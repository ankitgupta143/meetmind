import Groq from "groq-sdk";
import Meeting from "../models/Meeting.js";
import Transcript from "../models/Transcript.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function transcribeMeeting({
  meetingId,
  userId,
}) {
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

  meeting.processingStatus = "processing";
  meeting.processingError = null;
  await meeting.save();

  try {
    const response = await fetch(meeting.recording.url);

    if (!response.ok) {
      throw new Error(
        `Failed to download recording from Cloudinary. Status: ${response.status}`
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const file = new File(
      [buffer],
      meeting.recording.fileName || "meeting-recording.mp4",
      {
        type:
          meeting.recording.mimeType ||
          "application/octet-stream",
      }
    );

    const transcription =
      await groq.audio.transcriptions.create({
        file,
        model: "whisper-large-v3",
        response_format: "verbose_json",
      });

    console.log(
      "Transcription completed:",
      transcription
    );

    const transcriptDoc =
      await Transcript.findOneAndUpdate(
        {
          meetingId: meeting._id,
        },
        {
          meetingId: meeting._id,

          language:
            transcription.language?.toLowerCase() || "en",

          status: "completed",

          provider: "whisper",

          rawText: transcription.text || "",

          completedAt: new Date(),

          segments: (transcription.segments || []).map(
            (segment) => ({
              speaker: "Speaker 1",
              startTime: segment.start,
              endTime: segment.end,
              text: segment.text?.trim() || "",
            })
          ),
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      );

    console.log(
      "Transcript saved:",
      transcriptDoc._id
    );

    // Keep meeting duration in sync with transcription.
    meeting.durationSeconds =
      transcription.duration || 0;

    meeting.processingStatus = "completed";
    meeting.processingError = null;

    await meeting.save();

    return {
      transcript: transcriptDoc,
      text: transcription.text || "",
    };
  } catch (error) {
    meeting.processingStatus = "failed";

    meeting.processingError =
      error.message || "Transcription failed.";

    await meeting.save();

    throw error;
  }
}