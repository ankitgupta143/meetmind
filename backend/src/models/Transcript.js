import mongoose from "mongoose";

const { Schema } = mongoose;

const transcriptSegmentSchema = new Schema(
  {
    speaker: {
      type: String,
      required: [true, "Speaker is required"],
      trim: true,
      maxlength: [100, "Speaker name cannot exceed 100 characters"],
    },

    startTime: {
      type: Number,
      required: true,
      min: [0, "Start time cannot be negative"],
    },

    endTime: {
      type: Number,
      required: true,
      min: [0, "End time cannot be negative"],
    },

    text: {
      type: String,
      required: [true, "Transcript text is required"],
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const transcriptSchema = new Schema(
  {
    meetingId: {
      type: Schema.Types.ObjectId,
      ref: "Meeting",
      required: [true, "Meeting is required"],
      unique: true,
    },

    language: {
      type: String,
      default: "en",
      trim: true,
      lowercase: true,
    },

    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },

    provider: {
      type: String,
      enum: ["whisper", "assemblyai", "deepgram", "manual"],
      default: "whisper",
    },

    rawText: {
      type: String,
      default: "",
    },

    segments: {
      type: [transcriptSegmentSchema],
      default: [],
    },

    processingError: {
      type: String,
      default: null,
      maxlength: 2000,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// transcriptSchema.index({
//   meetingId: 1,
// });

const Transcript = mongoose.model("Transcript", transcriptSchema);

export default Transcript;