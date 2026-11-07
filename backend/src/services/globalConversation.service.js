import mongoose from "mongoose";
import GlobalConversation from "../models/GlobalConversation.js";
import { askGlobalAssistant } from "./globalAssistant.service.js";

const MAX_TITLE_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 2000;

/**
 * Validates that an ID is a valid MongoDB ObjectId.
 */
function validateObjectId(id, fieldName = "ID") {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error(`Invalid ${fieldName}.`);
    error.code = "INVALID_CONVERSATION_ID";
    throw error;
  }
}

/**
 * Create a new conversation document for the authenticated user.
 */
export async function createConversation({ userId, title }) {
  let conversationTitle = "New conversation";

  if (typeof title === "string" && title.trim()) {
    conversationTitle = title.trim();
    if (conversationTitle.length > MAX_TITLE_LENGTH) {
      const error = new Error(
        `Conversation title cannot exceed ${MAX_TITLE_LENGTH} characters.`
      );
      error.code = "TITLE_TOO_LONG";
      throw error;
    }
  }

  const conversation = await GlobalConversation.create({
    ownerId: userId,
    title: conversationTitle,
    messages: [],
    lastMessageAt: new Date(),
  });

  return {
    _id: conversation._id,
    title: conversation.title,
    messages: conversation.messages,
    lastMessageAt: conversation.lastMessageAt,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
  };
}

/**
 * Retrieve paginated conversations for the authenticated user (sidebar-safe).
 * Excludes full message bodies to keep the response lightweight.
 */
export async function getConversations({ userId, page = 1, limit = 20 }) {
  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (parsedPage - 1) * parsedLimit;

  const ownerObjectId = new mongoose.Types.ObjectId(userId);

  const [conversations, total] = await Promise.all([
    GlobalConversation.aggregate([
      { $match: { ownerId: ownerObjectId } },
      { $sort: { lastMessageAt: -1 } },
      { $skip: skip },
      { $limit: parsedLimit },
      {
        $project: {
          _id: 1,
          title: 1,
          lastMessageAt: 1,
          createdAt: 1,
          updatedAt: 1,
          messageCount: { $size: "$messages" },
        },
      },
    ]),
    GlobalConversation.countDocuments({ ownerId: userId }),
  ]);

  return {
    conversations,
    pagination: {
      total,
      page: parsedPage,
      limit: parsedLimit,
      totalPages: Math.ceil(total / parsedLimit) || 1,
    },
  };
}

/**
 * Retrieve an individual conversation with full message history.
 */
export async function getConversationById({ userId, conversationId }) {
  validateObjectId(conversationId, "conversation ID");

  const conversation = await GlobalConversation.findOne({
    _id: conversationId,
    ownerId: userId,
  }).lean();

  if (!conversation) {
    const error = new Error(
      "Conversation not found or you do not have permission to access it."
    );
    error.code = "CONVERSATION_NOT_FOUND";
    throw error;
  }

  return conversation;
}

/**
 * Send a message within a conversation:
 * 1. Validates ownership and input.
 * 2. Persists the user message immediately so it's not lost.
 * 3. Calls askGlobalAssistant() to generate an AI answer.
 * 4. Appends assistant response, updates title if first message, and updates lastMessageAt.
 */
export async function sendConversationMessage({
  userId,
  conversationId,
  message,
}) {
  validateObjectId(conversationId, "conversation ID");

  if (typeof message !== "string" || !message.trim()) {
    const error = new Error("Message is required.");
    error.code = "MESSAGE_REQUIRED";
    throw error;
  }

  const trimmedMessage = message.trim();
  if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
    const error = new Error(
      `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters.`
    );
    error.code = "MESSAGE_TOO_LONG";
    throw error;
  }

  const conversation = await GlobalConversation.findOne({
    _id: conversationId,
    ownerId: userId,
  });

  if (!conversation) {
    const error = new Error(
      "Conversation not found or you do not have permission to access it."
    );
    error.code = "CONVERSATION_NOT_FOUND";
    throw error;
  }

  // Count existing user messages to know if we should update conversation title
  const existingUserMessages = conversation.messages.filter(
    (msg) => msg.role === "user"
  ).length;

  // 1. Persist user message first (so it's preserved if AI generation fails)
  const userMessage = {
    role: "user",
    content: trimmedMessage,
    createdAt: new Date(),
  };

  conversation.messages.push(userMessage);
  conversation.lastMessageAt = new Date();
  await conversation.save();

  const savedUserMessage =
    conversation.messages[conversation.messages.length - 1];

  // 2. Call existing AI assistant service
  let aiResult;
  try {
    aiResult = await askGlobalAssistant({
      userId,
      message: trimmedMessage,
    });
  } catch (aiError) {
    // AI failed; the user message is safely persisted in DB.
    // Propagate error to controller so client can show retry state.
    const error = new Error(
      aiError.message || "Failed to generate AI response. Please try again."
    );
    error.code = aiError.code || "AI_SERVICE_ERROR";
    error.savedUserMessage = savedUserMessage;
    throw error;
  }

  // 3. Save assistant message and update title if this was the first user message
  const assistantMessage = {
    role: "assistant",
    content: aiResult.message || "",
    sources: aiResult.sources || [],
    createdAt: new Date(),
  };

  conversation.messages.push(assistantMessage);

  if (
    existingUserMessages === 0 &&
    (!conversation.title || conversation.title === "New conversation")
  ) {
    conversation.title =
      trimmedMessage.length > 40
        ? `${trimmedMessage.slice(0, 37)}...`
        : trimmedMessage;
  }

  conversation.lastMessageAt = new Date();
  await conversation.save();

  const savedAssistantMessage =
    conversation.messages[conversation.messages.length - 1];

  return {
    userMessage: savedUserMessage,
    assistantMessage: savedAssistantMessage,
    conversation: {
      _id: conversation._id,
      title: conversation.title,
      lastMessageAt: conversation.lastMessageAt,
      updatedAt: conversation.updatedAt,
    },
  };
}

/**
 * Delete a conversation owned by the authenticated user.
 */
export async function deleteConversation({ userId, conversationId }) {
  validateObjectId(conversationId, "conversation ID");

  const deleted = await GlobalConversation.findOneAndDelete({
    _id: conversationId,
    ownerId: userId,
  });

  if (!deleted) {
    const error = new Error(
      "Conversation not found or you do not have permission to delete it."
    );
    error.code = "CONVERSATION_NOT_FOUND";
    throw error;
  }

  return {
    success: true,
    message: "Conversation deleted successfully.",
  };
}
