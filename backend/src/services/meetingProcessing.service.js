import Meeting from "../models/Meeting.js";
import { generateMeetingInsights } from "./meetingInsights.service.js";
import { transcribeMeeting } from "./transcription.service.js";

export async function processMeeting({ meetingId, userId }) {
  try {
    console.log(`[Meeting Processing] Started: ${meetingId}`);

    // ----------------------------------------
    // 1. Transcription
    // ----------------------------------------

    await transcribeMeeting({
      meetingId,
      userId,
    });

    console.log(`[Meeting Processing] Transcription completed: ${meetingId}`);

    // ----------------------------------------
    // 2. AI Insights
    // ----------------------------------------

    // Wait for Groq token bucket to refill (free tier: 8000 tokens/min).
    // Transcription consumes ~2700 tokens; insights needs ~2048 output tokens.
    // A 30s pause ensures the bucket has enough headroom.
    console.log(`[Meeting Processing] Waiting 30s for Groq rate limit to reset...`);
    await new Promise((resolve) => setTimeout(resolve, 30_000));

    await generateMeetingInsights({
      meetingId,
      userId,
    });

    console.log(`[Meeting Processing] AI insights completed: ${meetingId}`);

    // ----------------------------------------
    // 3. Final meeting status
    // ----------------------------------------

    await Meeting.findOneAndUpdate(
      {
        _id: meetingId,
        ownerId: userId,
      },
      {
        processingStatus: "completed",
        processingError: null,
      },
    );

    console.log(`[Meeting Processing] Completed: ${meetingId}`);

    return true;
  } catch (error) {
    console.error(`[Meeting Processing] Failed: ${meetingId}`, error);

    await Meeting.findOneAndUpdate(
      {
        _id: meetingId,
        ownerId: userId,
      },
      {
        processingStatus: "failed",
        processingError: error.message || "Meeting processing failed.",
      },
    );

    throw error;
  }
}
