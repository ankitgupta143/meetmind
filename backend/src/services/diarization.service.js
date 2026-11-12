import { DeepgramClient } from "@deepgram/sdk";
import Meeting from "../models/Meeting.js";

const deepgram = new DeepgramClient({
  apiKey: process.env.DEEPGRAM_API_KEY,
});

export async function diarizeMeeting(meetingIdOrOptions, maybeUserId) {
  const meetingId =
    typeof meetingIdOrOptions === "object" && meetingIdOrOptions !== null
      ? meetingIdOrOptions.meetingId
      : meetingIdOrOptions;

  const userId =
    typeof meetingIdOrOptions === "object" && meetingIdOrOptions !== null
      ? meetingIdOrOptions.userId
      : maybeUserId;

  const meeting = await Meeting.findOne({
    _id: meetingId,
    ownerId: userId,
    status: { $ne: "deleted" },
  });

  if (!meeting) {
    throw new Error("Meeting not found.");
  }

  if (!meeting.recording?.url) {
    throw new Error("Meeting recording not found.");
  }

  const recordingUrl = new URL(meeting.recording.url);
  if (recordingUrl.protocol !== "https:" || !recordingUrl.hostname.endsWith("cloudinary.com")) {
    throw new Error("Invalid or untrusted recording URL source.");
  }

  const response = await deepgram.listen.v1.media.transcribeUrl({
    url: meeting.recording.url,
    model: "nova-3",
    diarize_model: "latest",
    utterances: true,
    smart_format: true,
  });

  console.dir(response, { depth: null });

  const utterances = response.results?.utterances || [];

  return utterances.map((utterance) => ({
    speaker: `Speaker ${utterance.speaker}`,
    startTime: utterance.start,
    endTime: utterance.end,
    text: utterance.transcript,
  }));
}
