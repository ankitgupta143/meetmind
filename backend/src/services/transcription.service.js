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

    // Groq Whisper API hard limit is 25 MB.
    // WAV files are uncompressed and can easily exceed this.
    // Ask the user to re-upload as MP3 or M4A.
    const GROQ_MAX_BYTES = 25 * 1024 * 1024; // 25 MB
    if (buffer.byteLength > GROQ_MAX_BYTES) {
      const sizeMB = (buffer.byteLength / 1024 / 1024).toFixed(1);
      const err = new Error(
        `Recording is ${sizeMB} MB. Groq Whisper only accepts files up to 25 MB. ` +
        `Please re-upload as MP3 or M4A — compressed formats are much smaller.`
      );
      err.code = "FILE_TOO_LARGE_FOR_TRANSCRIPTION";
      throw err;
    }

    console.log(`[Transcription] Sending ${(buffer.byteLength / 1024 / 1024).toFixed(1)} MB to Groq Whisper...`);

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