import Groq from "groq-sdk";
import Meeting from "../models/Meeting.js";
import Transcript from "../models/Transcript.js";
import MeetingInsights from "../models/MeetingInsights.js";
import { calculateSpeakerStats } from "../utils/calculateSpeakerStats.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Hardcoded — confirmed live on this Groq account (run `groq.models.list()` to verify).
// Do NOT read from process.env: nodemon does not reload .env on change,
// which causes stale model names to persist across restarts.
const AI_MODEL = "openai/gpt-oss-20b";
console.log(`[MeetingInsights] Using model: ${AI_MODEL}`);

export async function generateMeetingInsights({ meetingId, userId, speakerStats=[], }) {
  const meeting = await Meeting.findOne({
    _id: meetingId,
    ownerId: userId,
    status: { $ne: "deleted" },
  });

  if (!meeting) {
    const err = new Error("Meeting not found.");
    err.code = "MEETING_NOT_FOUND";
    throw err;
  }

  const transcript = await Transcript.findOne({
    meetingId: meeting._id,
    status: "completed",
  });

  if (!transcript) {
    const err = new Error(
      "Transcript not ready. Please run transcription before generating insights.",
    );
    err.code = "TRANSCRIPT_NOT_FOUND";
    throw err;
  }

  const segments = transcript.segments || [];

  const resolvedSpeakerStats =
    Array.isArray(speakerStats) && speakerStats.length > 0
      ? speakerStats
      : calculateSpeakerStats(segments);

  const messageCount = segments.length;

  const wordCount = segments.reduce((total, segment) => {
    return total + (segment.text?.trim().match(/\S+/g)?.length || 0);
  }, 0);

  const totalTalkTimeSeconds = segments.reduce((total, segment) => {
    const duration = Math.max(
      0,
      (segment.endTime || 0) - (segment.startTime || 0),
    );

    return total + duration;
  }, 0);

  const existingInsights = await MeetingInsights.findOne({
    meetingId: meeting._id,
  });

  if (existingInsights) {
    existingInsights.status = "processing";
    existingInsights.processingError = null;
    await existingInsights.save();
  } else {
    await MeetingInsights.create({
      meetingId: meeting._id,
      status: "processing",
      provider: "groq",
      model: AI_MODEL,
    });
  }

  try {
    const prompt = `
You are an AI meeting intelligence assistant.

Analyze the following meeting transcript and return ONLY valid JSON.

Do not use markdown.
Do not wrap the response in \`\`\`json.
Do not add explanations outside the JSON.

Return exactly this structure:

{
  "summary": {
    "overview": "string",
    "keyTakeaways": ["string"]
  },
  "actionItems": [
    {
      "title": "string",
      "description": "string",
      "assignee": "string or null",
      "dueDate": "ISO date string or null",
      "priority": "low | medium | high"
    }
  ],
  "decisions": [
    {
      "title": "string",
      "description": "string",
      "owner": "string or null"
    }
  ],
  "risks": [
    {
      "title": "string",
      "description": "string",
      "severity": "low | medium | high | critical"
    }
  ],
  "timeline": [
    {
      "timestamp": 0,
      "title": "string",
      "description": "string"
    }
  ],
  "analytics": {
    "sentiment": {
      "overall": "positive | neutral | negative",
      "score": 0
    },
    "topics": [
      {
        "name": "string",
        "percentage": 0
      }
    ]
  }
}

Rules:

- Do not invent action items.
- Do not invent decisions.
- Do not invent risks.
- If something is not present in the transcript, return an empty array.
- If an assignee is unknown, use null.
- If a due date is unknown, use null.
- sentiment.score must be between -1 and 1.
- topic percentages should approximately represent the relative discussion share.
- timeline timestamps must be seconds from the beginning of the meeting.
- Keep the summary concise.
- Use only information supported by the transcript.

Meeting title:
${meeting.title}

Transcript:
${transcript.rawText.slice(0, 6000)}
`;

    const completion = await groq.chat.completions.create({
      model: AI_MODEL,

      temperature: 0.2,

      max_tokens: 1500,

      messages: [
        {
          role: "system",
          content:
            "You produce reliable structured meeting intelligence from transcripts. Always return complete, valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: {
        type: "json_object",
      },
    });

    const content = completion.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("AI returned an empty response.");
    }

    let insights;

    try {
      insights = JSON.parse(content);
    } catch {
      throw new Error("AI returned invalid JSON.");
    }

    const updatedInsights = await MeetingInsights.findOneAndUpdate(
      {
        meetingId: meeting._id,
      },
      {
        meetingId: meeting._id,

        status: "completed",

        provider: "groq",

        model: AI_MODEL,

        processingError: null,

        generatedAt: new Date(),

        summary: {
          overview: insights.summary?.overview || "",

          keyTakeaways: Array.isArray(insights.summary?.keyTakeaways)
            ? insights.summary.keyTakeaways
            : [],
        },

        actionItems: Array.isArray(insights.actionItems)
          ? insights.actionItems
          : [],

        decisions: Array.isArray(insights.decisions) ? insights.decisions : [],

        risks: Array.isArray(insights.risks) ? insights.risks : [],

        timeline: Array.isArray(insights.timeline) ? insights.timeline : [],

        analytics: {
          totalDurationSeconds: meeting.durationSeconds || 0,

          messageCount,

          wordCount,

          totalTalkTimeSeconds,

          speakerStats: resolvedSpeakerStats,

          sentiment: {
            overall: insights.analytics?.sentiment?.overall || "neutral",

            score: insights.analytics?.sentiment?.score || 0,
          },

          topics: Array.isArray(insights.analytics?.topics)
            ? insights.analytics.topics
            : [],
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    return updatedInsights;
  } catch (error) {
    await MeetingInsights.findOneAndUpdate(
      {
        meetingId: meeting._id,
      },
      {
        status: "failed",
        processingError: error.message || "AI insight generation failed.",
      },
    );

    throw error;
  }
}

export async function getUserMeetingInsights({ meetingId, userId }) {
  const meeting = await Meeting.findOne({
    _id: meetingId,
    ownerId: userId,
    status: { $ne: "deleted" },
  })
    .select("_id")
    .lean();

  if (!meeting) {
    return null;
  }

  const insights = await MeetingInsights.findOne({
    meetingId: meeting._id,
  }).lean();

  return insights;
}
