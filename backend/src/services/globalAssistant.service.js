import Groq from "groq-sdk";
import Meeting from "../models/Meeting.js";
import Transcript from "../models/Transcript.js";
import MeetingInsights from "../models/MeetingInsights.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const AI_MODEL = process.env.GROQ_GLOBAL_ASSISTANT_MODEL || "openai/gpt-oss-20b";

const MAX_MEETINGS = 5;
const MAX_TRANSCRIPT_CHARS = 1200;
const MAX_MESSAGE_LENGTH = 2000;

export async function askGlobalAssistant({ userId, message }) {
  if (typeof message !== "string" || !message.trim()) {
    const error = new Error("Message is required.");
    error.code = "Message_REQUIRED";
    throw error;
  }

  const question = message.trim();

  if (question.length > MAX_MESSAGE_LENGTH) {
    const error = new Error(
      `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters.`,
    );
    error.code = "MESSAGE_TOO_LONG";
    throw error;
  }

  const meetings = await Meeting.find({
    ownerId: userId,
    status: { $ne: "deleted" },
  })
    .sort({ meetingDate: -1, createdAt: -1 })
    .limit(MAX_MEETINGS)
    .select(
      "_id title description meetingDate durationSeconds participants status processingStatus",
    )
    .lean();

  if (meetings.length === 0) {
    return {
      message:
        "You don't have any meetings available yet. Upload a meeting first, and I'll help you explore its discussions and decisions.",
    };
  }

  const meetingIds = meetings.map((meeting) => meeting._id);

  const [transcripts, insightList] = await Promise.all([
    Transcript.find({
      meetingId: { $in: meetingIds },
      status: "completed",
    })
      .select("meetingId rawText language")
      .lean(),

    MeetingInsights.find({
      meetingId: { $in: meetingIds },
      status: "completed",
    })
      .select(
        "meetingId summary actionItems decisions risks",
      )
      .lean(),
  ]);

  // 4. Index the results by meeting ID for efficient lookup.
  const transcriptMap = new Map(
    transcripts.map((transcript) => [String(transcript.meetingId), transcript]),
  );

  const insightsMap = new Map(
    insightList.map((insights) => [String(insights.meetingId), insights]),
  );

  // 5. Build a compact, bounded context for the AI to stay within TPM limits.
  const meetingContext = meetings.map((meeting) => {
    const meetingId = String(meeting._id);
    const transcript = transcriptMap.get(meetingId);
    const insights = insightsMap.get(meetingId);

    const maxTranscriptLength = insights ? 600 : MAX_TRANSCRIPT_CHARS;

    return {
      meetingId,
      title: meeting.title,
      description: meeting.description || "",
      meetingDate: meeting.meetingDate,
      durationSeconds: meeting.durationSeconds || 0,
      participants: meeting.participants || [],

      transcriptSnippet: transcript
        ? (transcript.rawText || "").slice(0, maxTranscriptLength)
        : null,

      insights: insights
        ? {
            overview: insights.summary?.overview || "",
            keyPoints: insights.summary?.keyPoints || [],
            actionItems: (insights.actionItems || []).map((item) => ({
              title: item.title,
              assignee: item.assignee,
              dueDate: item.dueDate,
              status: item.status,
            })),
            decisions: (insights.decisions || []).map((d) => ({
              title: d.title,
              description: d.description,
            })),
            risks: (insights.risks || []).map((r) => ({
              title: r.title,
              severity: r.severity,
            })),
          }
        : null,
    };
  });

  const readyTranscriptCount = meetingContext.filter(
    (meeting) => meeting.transcriptSnippet,
  ).length;

  // 6. Ask Groq to answer using the supplied workspace context.
  const prompt = `
You are MeetMind's Global AI Meeting Assistant.

You help the authenticated user understand information across
their recorded meetings.

USER QUESTION:
${question}

MEETING WORKSPACE DATA:
${JSON.stringify(meetingContext)}

RULES:
- Use only the supplied meeting data to answer questions about meetings.
- Never invent meetings, people, quotations, decisions, deadlines, or statistics.
- For summaries, prioritize the structured meeting insights when available.
- For questions about what was actually said, use the transcript text.
- For cross-meeting questions, compare the available meetings when relevant.
- Mention meeting titles and dates when they help identify the source.
- If information is missing, say so clearly.
- If no relevant evidence is present, do not pretend that a search found a result.
- Some transcripts may be truncated. Do not claim to have searched their entire contents.
- Distinguish overdue tasks from tasks whose due dates or completion status
  are unknown. Do not assume a task is overdue without sufficient data.
- Keep the answer clear, structured, and concise.
- Return a useful answer in Markdown.
`;

  try {
    const completion = await groq.chat.completions.create({
      model: AI_MODEL,
      temperature: 0.2,
      max_tokens: 1200,
      messages: [
        {
          role: "system",
          content:
            "You are a reliable meeting intelligence assistant. Ground factual answers in the provided workspace data.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const answer = completion.choices?.[0]?.message?.content?.trim();

    if (!answer) {
      throw new Error("AI returned an empty response.");
    }

    return {
      message: answer,
      context: {
        meetingsConsidered: meetings.length,
        transcriptsAvailable: readyTranscriptCount,
      },
    };
  } catch (error) {
    console.error("[Global Assistant] AI request failed:", error);

    const message =
      error?.status === 413 || error?.error?.code === "rate_limit_exceeded"
        ? "AI service rate limit exceeded. Please wait a few seconds and try again."
        : "Failed to generate a global assistant response.";
    const err = new Error(message);
    err.code = "AI_SERVICE_ERROR";
    throw err;
  }
}
