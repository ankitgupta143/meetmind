import mongoose from "mongoose";

const { Schema } = mongoose;

const sourceSchema = new Schema(
  {
    meetingId: {
      type: Schema.Types.ObjectId,
      ref: "Meeting",
      required: [true, "Source meetingId is required"],
    },
    meetingTitle: {
      type: String,
      required: [true, "Source meetingTitle is required"],
      trim: true,
      maxlength: 200,
    },
    excerpt: {
      type: String,
      required: [true, "Source excerpt is required"],
      trim: true,
      maxlength: 1000,
    },
    startTime: {
      type: Number,
      default: null,
      min: 0,
    },
    endTime: {
      type: Number,
      default: null,
      min: 0,
    },
    speaker: {
      type: String,
      default: null,
      trim: true,
      maxlength: 100,
    },
  },
  {
    _id: false,
  }
);

const messageSchema = new Schema(
  {
    role: {
      type: String,
      enum: {
        values: ["user", "assistant"],
        message: "{VALUE} is not a valid message role",
      },
      required: [true, "Message role is required"],
    },
    content: {
      type: String,
      required: [true, "Message content is required"],
      trim: true,
    },
    sources: {
      type: [sourceSchema],
      default: undefined, // Backward compatible: undefined for older or user messages
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
  // Subdocument IDs (_id) are enabled by default
);

const globalConversationSchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Conversation owner is required"],
      index: true,
    },
    title: {
      type: String,
      required: [true, "Conversation title is required"],
      trim: true,
      maxlength: [100, "Conversation title cannot exceed 100 characters"],
      default: "New conversation",
    },
    messages: [messageSchema],
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

globalConversationSchema.index({ ownerId: 1, lastMessageAt: -1 });

const GlobalConversation = mongoose.model(
  "GlobalConversation",
  globalConversationSchema
);

export default GlobalConversation;
