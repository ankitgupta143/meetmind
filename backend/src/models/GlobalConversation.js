import mongoose from "mongoose";

const { Schema } = mongoose;

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
