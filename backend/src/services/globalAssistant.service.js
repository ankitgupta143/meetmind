import Groq from "groq-sdk";
import Meeting from "../models/Meeting.js";
import Transcript from "../models/Transcript.js";
import MeetingInsights from "../models/MeetingInsights.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const AI_MODEL = process.env.GROQ_GLOBAL_ASSISTANT_MODEL || "openai/gpt-oss-20b";

const MAX_MEETINGS = 5;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_EXCERPT_CHARS = 300;
const MAX_SOURCES_RETURNED = 5;

/**
 * Filter or slice segments to fit context cleanly
 */
function getCandidateSegments(segments = [], maxSegments = 6) {
  if (!Array.isArray(segments) || segments.length === 0) return [];
  if (segments.length <= maxSegments) return segments;
  return segments.slice(0, maxSegments);
}

/**
 * Prepares the grounded meeting context, prompt, and source registry
 */
export async function prepareGlobalAssistantContext({ userId, message }) {
  if (typeof message !== "string" || !message.trim()) {
    const error = new Error("Message is required.");
    error.code = "MESSAGE_REQUIRED";
    throw error;
  }

  const question = message.trim();

  if (question.length > MAX_MESSAGE_LENGTH) {
    const error = new Error(
      `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters.`
    );
    error.code = "MESSAGE_TOO_LONG";
    throw error;
  }

  // 1. Fetch user's non-deleted meetings
  const meetings = await Meeting.find({
    ownerId: userId,
    status: { $ne: "deleted" },
  })
    .sort({ meetingDate: -1, createdAt: -1 })
    .limit(MAX_MEETINGS)
    .select(
      "_id title description meetingDate durationSeconds participants status processingStatus"
    )
    .lean();

  if (meetings.length === 0) {
    return {
      earlyReturn: {
        message:
          "You don't have any meetings available yet. Upload a meeting first, and I'll help you explore its discussions and decisions.",
        sources: [],
      },
    };
  }

  const meetingIds = meetings.map((meeting) => meeting._id);

  // 2. Fetch completed Transcripts (including segments) and MeetingInsights
  const [transcripts, insightList] = await Promise.all([
    Transcript.find({
      meetingId: { $in: meetingIds },
      status: "completed",
    })
      .select("meetingId rawText language segments")
      .lean(),

    MeetingInsights.find({
      meetingId: { $in: meetingIds },
      status: "completed",
    })
      .select("meetingId summary actionItems decisions risks")
      .lean(),
  ]);

  const transcriptMap = new Map(
    transcripts.map((transcript) => [String(transcript.meetingId), transcript])
  );

  const insightsMap = new Map(
    insightList.map((insights) => [String(insights.meetingId), insights])
  );

  // 3. Build a source registry for deterministic, un-hallucinated citations
  // Map: "SRC-1" -> { meetingId, meetingTitle, excerpt, startTime, endTime, speaker }
  const sourceRegistry = new Map();
  let sourceCounter = 1;

  const meetingContext = meetings.map((meeting) => {
    const meetingIdStr = String(meeting._id);
    const transcript = transcriptMap.get(meetingIdStr);
    const insights = insightsMap.get(meetingIdStr);

    const segments = transcript?.segments || [];
    const candidateSegments = getCandidateSegments(segments, 6);

    const indexedSources = [];

    if (candidateSegments.length > 0) {
      for (const seg of candidateSegments) {
        if (!seg.text || !seg.text.trim()) continue;
        const tag = `SRC-${sourceCounter++}`;
        const sourceData = {
          meetingId: meetingIdStr,
          meetingTitle: meeting.title,
          excerpt: seg.text.trim().slice(0, MAX_EXCERPT_CHARS),
          startTime: typeof seg.startTime === "number" ? seg.startTime : null,
          endTime: typeof seg.endTime === "number" ? seg.endTime : null,
          speaker: seg.speaker || null,
        };
        sourceRegistry.set(tag, sourceData);
        indexedSources.push({
          sourceTag: tag,
          speaker: seg.speaker,
          time: seg.startTime,
          text: seg.text.slice(0, 250),
        });
      }
    } else if (transcript?.rawText?.trim()) {
      // Fallback if transcript has rawText but no segments
      const tag = `SRC-${sourceCounter++}`;
      const snippet = transcript.rawText.trim().slice(0, MAX_EXCERPT_CHARS);
      sourceRegistry.set(tag, {
        meetingId: meetingIdStr,
        meetingTitle: meeting.title,
        excerpt: snippet,
        startTime: null,
        endTime: null,
        speaker: null,
      });
      indexedSources.push({
        sourceTag: tag,
        text: snippet,
      });
    }

    return {
      meetingId: meetingIdStr,
      title: meeting.title,
      meetingDate: meeting.meetingDate,
      insights: insights
        ? {
            overview: insights.summary?.overview || "",
            actionItems: (insights.actionItems || []).map((item) => ({
              title: item.title,
              assignee: item.assignee,
              status: item.status,
            })),
            decisions: (insights.decisions || []).map((d) => ({
              title: d.title,
              description: d.description,
            })),
          }
        : null,
      transcriptExcerpts: indexedSources,
    };
  });

  const readyTranscriptCount = meetingContext.filter(
    (meeting) => meeting.transcriptExcerpts.length > 0
  ).length;

  // 4. Construct prompt instructing the AI to provide answers with source tags
  const prompt = `
You are MeetMind's Global AI Meeting Assistant.

USER QUESTION:
${question}

AVAILABLE MEETING WORKSPACE CONTEXT:
${JSON.stringify(meetingContext, null, 2)}

INSTRUCTIONS & CITATION RULES:
1. Answer the question using ONLY the provided meeting data.
2. If any statement is based on a transcript excerpt, cite the relevant [SRC-#] tag in your response.
3. At the end of your response, you MUST output a JSON block listing all source tags you cited or used to construct your answer, formatted exactly as:
\`\`\`sources
["SRC-1", "SRC-2"]
\`\`\`
If no meeting transcripts or excerpts directly support the answer, output:
\`\`\`sources
[]
\`\`\`
4. Do not invent source tags, meeting IDs, or excerpts that do not appear in the context.
5. Provide a helpful, clean markdown response.
`;

  return {
    question,
    prompt,
    meetings,
    sourceRegistry,
    readyTranscriptCount,
  };
}

/**
 * Parses source tags and cleans raw output from Groq
 */
export function parseAndVerifySources({ rawContent, meetings, sourceRegistry }) {
  if (!rawContent) return { cleanMessage: "", verifiedSources: [] };

  const citedTags = new Set();

  // Check for ```sources [...] ``` or ```json [...] ``` block
  const sourcesBlockRegex = /```(?:sources|json)?\s*(\[[^\]]*\])\s*```/i;
  const match = rawContent.match(sourcesBlockRegex);

  let cleanMessage = rawContent;

  if (match) {
    try {
      const parsed = JSON.parse(match[1]);
      if (Array.isArray(parsed)) {
        parsed.forEach((tag) => {
          if (typeof tag === "string" && tag.startsWith("SRC-")) {
            citedTags.add(tag);
          }
        });
      }
    } catch (_) {}
    // Strip trailing sources code block from user-visible message
    cleanMessage = rawContent.replace(sourcesBlockRegex, "").trim();
  }

  // Also regex scan text for inline [SRC-X] tags
  const inlineTagRegex = /\[(SRC-\d+)\]/g;
  let inlineMatch;
  while ((inlineMatch = inlineTagRegex.exec(cleanMessage)) !== null) {
    citedTags.add(inlineMatch[1]);
  }

  // Also clean up any unclosed trailing backticks
  cleanMessage = cleanMessage.replace(/```(?:sources|json)?\s*$/i, "").trim();

  // Map cited tags to verified database records
  const verifiedSources = [];
  const addedExcerpts = new Set();

  for (const tag of citedTags) {
    if (sourceRegistry.has(tag)) {
      const sourceData = sourceRegistry.get(tag);
      const dedupeKey = `${sourceData.meetingId}-${sourceData.startTime}-${sourceData.excerpt.slice(0, 30)}`;
      if (!addedExcerpts.has(dedupeKey)) {
        addedExcerpts.add(dedupeKey);
        verifiedSources.push(sourceData);
        if (verifiedSources.length >= MAX_SOURCES_RETURNED) break;
      }
    }
  }

  // Fallback: If AI referenced a meeting by title in cleanMessage but missed tags
  if (verifiedSources.length === 0 && Array.isArray(meetings)) {
    for (const meeting of meetings) {
      if (cleanMessage.toLowerCase().includes(meeting.title.toLowerCase())) {
        for (const [, sourceData] of sourceRegistry.entries()) {
          if (sourceData.meetingId === String(meeting._id)) {
            verifiedSources.push(sourceData);
            break;
          }
        }
        if (verifiedSources.length >= 2) break;
      }
    }
  }

  return {
    cleanMessage,
    verifiedSources,
  };
}

/**
 * Synchronous / Non-streaming AI completion (Preserved for backwards compatibility)
 */
export async function askGlobalAssistant({ userId, message }) {
  const contextData = await prepareGlobalAssistantContext({ userId, message });

  if (contextData.earlyReturn) {
    return contextData.earlyReturn;
  }

  const { prompt, meetings, readyTranscriptCount, sourceRegistry } = contextData;

  try {
    const completion = await groq.chat.completions.create({
      model: AI_MODEL,
      temperature: 0.2,
      max_tokens: 1200,
      messages: [
        {
          role: "system",
          content:
            "You are a reliable meeting intelligence assistant. Ground answers strictly in the workspace data and cite sources accurately.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const rawContent = completion.choices?.[0]?.message?.content?.trim();

    if (!rawContent) {
      throw new Error("AI returned an empty response.");
    }

    const { cleanMessage, verifiedSources } = parseAndVerifySources({
      rawContent,
      meetings,
      sourceRegistry,
    });

    return {
      message: cleanMessage,
      sources: verifiedSources,
      context: {
        meetingsConsidered: meetings.length,
        transcriptsAvailable: readyTranscriptCount,
      },
    };
  } catch (error) {
    console.error("[Global Assistant] AI request failed:", error);

    const errorMsg =
      error?.status === 413 || error?.error?.code === "rate_limit_exceeded"
        ? "AI service rate limit exceeded. Please wait a few seconds and try again."
        : "Failed to generate a global assistant response.";
    const err = new Error(errorMsg);
    err.code = "AI_SERVICE_ERROR";
    throw err;
  }
}

/**
 * Real-time SSE streaming AI completion with automatic source suppression
 */
export async function askGlobalAssistantStream({
  userId,
  message,
  onToken,
  isAbortedRef,
}) {
  const contextData = await prepareGlobalAssistantContext({ userId, message });

  if (contextData.earlyReturn) {
    onToken?.({
      delta: contextData.earlyReturn.message,
      accumulated: contextData.earlyReturn.message,
    });
    return contextData.earlyReturn;
  }

  const { prompt, meetings, readyTranscriptCount, sourceRegistry } = contextData;

  try {
    const stream = await groq.chat.completions.create({
      model: AI_MODEL,
      temperature: 0.2,
      max_tokens: 1200,
      stream: true,
      messages: [
        {
          role: "system",
          content:
            "You are a reliable meeting intelligence assistant. Ground answers strictly in the workspace data and cite sources accurately.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    let rawContent = "";
    let inSourcesBlock = false;

    for await (const chunk of stream) {
      if (isAbortedRef?.current) {
        break;
      }

      const delta = chunk.choices?.[0]?.delta?.content || "";
      if (!delta) continue;

      rawContent += delta;

      // Check if we entered the trailing ```sources or ```json block
      if (!inSourcesBlock) {
        const match = rawContent.match(/```(?:sources|json)?\s*\[/i);
        if (match && match.index !== undefined) {
          inSourcesBlock = true;
        }
      }

      // Only emit user-visible tokens outside the sources block
      if (!inSourcesBlock) {
        // Strip any trailing partial backticks before the code fence
        const cleanSoFar = rawContent.replace(/```(?:sources|json)?$/i, "");
        onToken?.({
          delta,
          accumulated: cleanSoFar,
        });
      }
    }

    const { cleanMessage, verifiedSources } = parseAndVerifySources({
      rawContent,
      meetings,
      sourceRegistry,
    });

    return {
      message: cleanMessage,
      sources: verifiedSources,
      context: {
        meetingsConsidered: meetings.length,
        transcriptsAvailable: readyTranscriptCount,
      },
    };
  } catch (error) {
    console.error("[Global Assistant Stream] AI stream request failed:", error);

    const errorMsg =
      error?.status === 413 || error?.error?.code === "rate_limit_exceeded"
        ? "AI service rate limit exceeded. Please wait a few seconds and try again."
        : "Failed to generate a global assistant response.";
    const err = new Error(errorMsg);
    err.code = "AI_SERVICE_ERROR";
    throw err;
  }
}
