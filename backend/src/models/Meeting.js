import mongoose from "mongoose";

const { Schema } = mongoose;

const meetingSchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Meeting owner is required"],
    },
    title: {
      type: String,
      required: [true, "Meeting title is required"],
      trim: true,
      maxlength: [200, "Meeting title cannot exceed 200 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Meeting description cannot exceed 2000 characters"],
      default: "",
    },
    meetingDate: {
      type: Date,
      required: [true, "Meeting date is required"],
    },

    durationSeconds: {
      type: Number,
      min: [0, "Duration cannot be negative"],
      default: 0,
    },
    participants: [
      {
        name: {
          type: String,
          trim: true,
          maxlength: 100,
        },

        email: {
          type: String,
          trim: true,
          lowercase: true,
          maxlength: 254,
        },
      },
    ],
    recording: {
      url: {
        type: String,
        default: null,
      },

      publicId: {
        type: String,
        default: null,
      },

      fileName: {
        type: String,
        trim: true,
        default: null,
      },

      fileSize: {
        type: Number,
        min: 0,
        default: null,
      },

      mimeType: {
        type: String,
        default: null,
      },

      durationSeconds: {
        type: Number,
        min: 0,
        default: null,
      },
    },
    source: {
      type: String,
      enum: ["upload", "google-meet", "zoom", "teams", "calendar"],
      default: "upload",
    },
    status: {
      type: String,
      enum: ["draft", "ready", "archived", "deleted"],
      default: "draft",
    },
    processingStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },

    processingError: {
      type: String,
      default: null,
      maxlength: 2000,
    },

    isFavorite: {
      type: Boolean,
      default: false,
    },

    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

meetingSchema.index({ ownerId: 1, createdAt: -1 });
meetingSchema.index({ ownerId: 1, isFavorite: 1 });
meetingSchema.index({ ownerId: 1, isPinned: 1 });

const Meeting = mongoose.model("Meeting", meetingSchema);
export default Meeting;
