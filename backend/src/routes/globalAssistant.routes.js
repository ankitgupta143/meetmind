import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  globalAssistantController,
  createConversationController,
  getConversationsController,
  getConversationByIdController,
  sendConversationMessageController,
  deleteConversationController,
  updateConversationTitleController,
} from "../controllers/globalAssistant.controller.js";

const router = express.Router();

// Direct chat endpoint (preserved for backwards compatibility)
router.post("/chat", authenticate, globalAssistantController);

// Persisted Conversation Endpoints
router.post("/conversations", authenticate, createConversationController);
router.get("/conversations", authenticate, getConversationsController);
router.get(
  "/conversations/:conversationId",
  authenticate,
  getConversationByIdController
);
router.post(
  "/conversations/:conversationId/messages",
  authenticate,
  sendConversationMessageController
);
router.delete(
  "/conversations/:conversationId",
  authenticate,
  deleteConversationController
);
router.patch(
  "/conversations/:conversationId",
  authenticate,
  updateConversationTitleController
);

export default router;
