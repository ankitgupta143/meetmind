import mongoose from "mongoose";

const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Recipient is required"],
      index: true,
    },
    type: {
      type: String,
      enum: [
        "processing",
        "upload",
        "export",
        "meeting",
        "reminder",
        "ai",
        "workspace",
        "comment",
        "mention",
      ],
      default: "ai",
    },
    title: {
      type: String,
      required: [true, "Notification title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
      default: "",
    },
    meetingId: {
      type: Schema.Types.ObjectId,
      ref: "Meeting",
      default: null,
    },
    link: {
      type: String,
      trim: true,
      default: null,
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for querying user notifications sorted by recency
notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });

export default mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);
