import Meeting from "../models/Meeting.js";
import Transcript from "../models/Transcript.js";
import { matchTranscriptSpeakers } from "../utils/matchTranscriptSpeakers.js";
import { diarizeMeeting } from "./diarization.service.js";
import MeetingInsights from "../models/MeetingInsights.js";
import { calculateSpeakerStats } from "../utils/calculateSpeakerStats.js";

export async function previewTranscriptDiarization({ meetingId, userId }) {
  const meeting = await Meeting.findOne({
    _id: meetingId,
    ownerId: userId,
    status: { $ne: "deleted" },
  })
    .select("_id")
    .lean();

  if (!meeting) {
    const error = new Error("Meeting not found.");
    error.code = "MEETING_NOT_FOUND";
    throw error;
  }

  const transcript = await Transcript.findOne({
    meetingId: meeting._id,
    status: "completed",
  }).lean();

  if (!transcript) {
    const error = new Error("Transcript not found or not completed.");
    error.code = "TRANSCRIPT_NOT_FOUND";
    throw error;
  }

  const diarizationSegments = await diarizeMeeting({ meetingId, userId });

  const transcriptSegments = transcript.segments ?? [];

  const mergedSegments = matchTranscriptSpeakers(
    transcriptSegments,
    diarizationSegments,
  );

  return {
    transcriptId: transcript._id,
    segments: mergedSegments,
  };
}

export async function applyTranscriptDiarization({ meetingId, userId }) {
  const meeting = await Meeting.findOne({
    _id: meetingId,
    ownerId: userId,
    status: { $ne: "deleted" },
  })
    .select("_id")
    .lean();

  if (!meeting) {
    const error = new Error("Meeting not found.");
    error.code = "MEETING_NOT_FOUND";
    throw error;
  }

  const transcript = await Transcript.findOne({
    meetingId: meeting._id,
    status: "completed",
  });

  if (!transcript) {
    const error = new Error("Transcript not found or not completed.");
    error.code = "TRANSCRIPT_NOT_FOUND";
    throw error;
  }

  const diarizationSegments = await diarizeMeeting({
    meetingId,
    userId,
  });

  const transcriptSegments = transcript.segments ?? [];

  const mergedSegments = matchTranscriptSpeakers(
    transcriptSegments,
    diarizationSegments,
  );

  const speakerStats = calculateSpeakerStats(mergedSegments);

  transcript.segments = mergedSegments;

  await transcript.save();

  await MeetingInsights.findOneAndUpdate(
    {
      meetingId: meeting._id,
    },
    {
      $set: {
        "analytics.speakerStats": speakerStats,
      },
    },
  );

  return {
    transcriptId: transcript._id,
    segments: transcript.segments,
    speakerStats,
  };
}
