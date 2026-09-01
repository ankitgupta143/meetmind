import Groq from "groq-sdk";

import Meeting from "../models/Meeting.js";
import Transcript from "../models/Transcript.js";
import MeetingInsights from "../models/MeetingInsights.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const AI_MODEL = "openai/gpt-oss-120b";

export async function askMeetingAssistant({
  meetingId,
  userId,
  message,
}) {
  // 1. Verify meeting ownership
  const meeting = await Meeting.findOne({
    _id: meetingId,
    ownerId: userId,
    status: { $ne: "deleted" },
  }).lean();

  if (!meeting) {
    const error = new Error("Meeting not found.");
    error.code = "MEETING_NOT_FOUND";
    throw error;
  }

  // 2. Validate question
  if (!message?.trim()) {
    const error = new Error("Message is required.");
    error.code = "MESSAGE_REQUIRED";
    throw error;
  }

  // 3. Get transcript
  const transcript = await Transcript.findOne({
    meetingId: meeting._id,
    status: "completed",
  }).lean();

  if (!transcript) {
    const error = new Error(
      "Transcript is not ready for this meeting.",
    );
    error.code = "TRANSCRIPT_NOT_FOUND";
    throw error;
  }

  // 4. Get AI insights if available
  const insights = await MeetingInsights.findOne({
    meetingId: meeting._id,
    status: "completed",
  }).lean();

  // 5. Build meeting context
  const context = {
    meeting: {
      title: meeting.title,
      description: meeting.description || "",
      meetingDate: meeting.meetingDate,
      durationSeconds: meeting.durationSeconds || 0,
      participants: meeting.participants || [],
    },

    transcript: {
      text: transcript.rawText || "",
    },

    insights: insights
      ? {
          summary: insights.summary || {},
          actionItems: insights.actionItems || [],
          decisions: insights.decisions || [],
          risks: insights.risks || [],
          timeline: insights.timeline || [],
          analytics: insights.analytics || {},
        }
      : null,
  };

  /*
   * Keep the context reasonably small.
   *
   * Later, when transcripts become very large,
   * we can introduce chunking / retrieval.
   */
  const transcriptText = context.transcript.text.slice(0, 12000);

  const prompt = `
You are MeetMind's AI meeting assistant.

You answer questions about ONE specific meeting.

IMPORTANT RULES:

- Answer only using information contained in the meeting context.
- Do not invent facts.
- Do not assume information that is not present.
- If the answer cannot be determined from the meeting data, clearly say that.
- Keep answers concise but useful.
- When the user asks about action items, decisions, risks, topics,
  summary, sentiment, or timeline, prefer the structured AI insights
  when available.
- The transcript is the source of truth for what was actually said.
- Do not answer as a general-purpose assistant.
- Do not mention internal database fields unless necessary.

MEETING:

Title:
${context.meeting.title}

Description:
${context.meeting.description}

Participants:
${JSON.stringify(context.meeting.participants)}

TRANSCRIPT:

${transcriptText}

MEETING AI INSIGHTS:

${JSON.stringify(context.insights)}

USER QUESTION:

${message.trim()}
`;

  try {
    const completion =
      await groq.chat.completions.create({
        model: AI_MODEL,
        temperature: 0.2,
        max_tokens: 800,
        messages: [
          {
            role: "system",
            content:
              "You are a reliable meeting assistant. Answer only from the supplied meeting context.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });

    const answer =
      completion.choices?.[0]?.message?.content?.trim();

    if (!answer) {
      throw new Error(
        "AI returned an empty response.",
      );
    }

    return {
      message: answer,
    };
  } catch (error) {
    console.error(
      "[Meeting Assistant] AI request failed:",
      error,
    );

    throw new Error(
      error.message ||
        "Failed to generate assistant response.",
    );
  }
}