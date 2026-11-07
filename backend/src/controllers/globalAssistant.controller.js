import { askGlobalAssistant } from "../services/globalAssistant.service.js";
import {
  createConversation,
  getConversations,
  getConversationById,
  sendConversationMessage,
  deleteConversation,
} from "../services/globalConversation.service.js";

/**
 * Legacy direct chat endpoint (/api/v1/global-assistant/chat)
 */
export async function globalAssistantController(req, res, next) {
  try {
    const { message } = req.body;
    const result = await askGlobalAssistant({
      userId: req.user.id,
      message,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/global-assistant/conversations
 * Create a new conversation for the authenticated user.
 */
export async function createConversationController(req, res, next) {
  try {
    const { title } = req.body || {};
    const conversation = await createConversation({
      userId: req.user.id,
      title,
    });

    return res.status(201).json({
      success: true,
      data: {
        conversation,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/global-assistant/conversations
 * Retrieve paginated conversations for sidebar/history.
 */
export async function getConversationsController(req, res, next) {
  try {
    const { page, limit } = req.query;
    const result = await getConversations({
      userId: req.user.id,
      page,
      limit,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/global-assistant/conversations/:conversationId
 * Retrieve a specific conversation with full messages.
 */
export async function getConversationByIdController(req, res, next) {
  try {
    const { conversationId } = req.params;
    const conversation = await getConversationById({
      userId: req.user.id,
      conversationId,
    });

    return res.status(200).json({
      success: true,
      data: {
        conversation,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/global-assistant/conversations/:conversationId/messages
 * Send a user message and receive AI response with persistence.
 */
export async function sendConversationMessageController(req, res, next) {
  try {
    const { conversationId } = req.params;
    const { message } = req.body || {};

    const result = await sendConversationMessage({
      userId: req.user.id,
      conversationId,
      message,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/v1/global-assistant/conversations/:conversationId
 * Delete a user's conversation.
 */
export async function deleteConversationController(req, res, next) {
  try {
    const { conversationId } = req.params;
    const result = await deleteConversation({
      userId: req.user.id,
      conversationId,
    });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
