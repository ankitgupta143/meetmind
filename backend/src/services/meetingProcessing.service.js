import Meeting from "../models/Meeting.js";
import { generateMeetingInsights } from "./meetingInsights.service.js";
import { transcribeMeeting } from "./transcription.service.js";
import { applyTranscriptDiarization } from "./transcriptDiarization.service.js";
import { createNotification } from "./notification.service.js";

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
    // 2. Speaker Diarization
    // ----------------------------------------

    const diarizationResult = await applyTranscriptDiarization({
      meetingId,
      userId,
    });

    console.log(
      `[Meeting Processing] Speaker diarization completed: ${meetingId}`,
    );

    // ----------------------------------------
    // 3. AI Insights
    // ----------------------------------------

    // Wait for Groq token bucket to refill (free tier: 8000 tokens/min).
    // Transcription consumes ~2700 tokens; insights needs ~2048 output tokens.
    // A 30s pause ensures the bucket has enough headroom.
    console.log(
      `[Meeting Processing] Waiting 30s for Groq rate limit to reset...`,
    );

    await new Promise((resolve) => setTimeout(resolve, 30_000));

    await generateMeetingInsights({
      meetingId,
      userId,
      speakerStats: diarizationResult.speakerStats,
    });

    console.log(`[Meeting Processing] AI insights completed: ${meetingId}`);

    // ----------------------------------------
    // 4. Final meeting status
    // ----------------------------------------

    const updatedMeeting = await Meeting.findOneAndUpdate(
      {
        _id: meetingId,
        ownerId: userId,
      },
      {
        processingStatus: "completed",
        processingError: null,
      },
      { new: true },
    );

    console.log(`[Meeting Processing] Completed: ${meetingId}`);

    try {
      await createNotification({
        recipient: userId,
        type: "ai",
        title: "AI Summary Ready",
        description: updatedMeeting?.title || "Your meeting transcript & insights are ready",
        meetingId: updatedMeeting?._id || meetingId,
        link: `/meetings/${meetingId}`,
      });
    } catch (notifErr) {
      console.warn(`[Meeting Processing] Failed to create completion notification:`, notifErr.message);
    }

    return true;
  } catch (error) {
    console.error(`[Meeting Processing] Failed: ${meetingId}`, error);

    const failedMeeting = await Meeting.findOneAndUpdate(
      {
        _id: meetingId,
        ownerId: userId,
      },
      {
        processingStatus: "failed",
        processingError: error.message || "Meeting processing failed.",
      },
      { new: true },
    );

    try {
      await createNotification({
        recipient: userId,
        type: "processing",
        title: "Processing Failed",
        description: `Failed to process ${failedMeeting?.title || "meeting"}.`,
        meetingId,
        link: `/meetings/${meetingId}`,
      });
    } catch (notifErr) {
      console.warn(`[Meeting Processing] Failed to create failure notification:`, notifErr.message);
    }

    throw error;
  }
}
