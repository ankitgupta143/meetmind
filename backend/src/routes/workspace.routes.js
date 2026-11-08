import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  getWorkspaceOverviewController,
  toggleFavoriteMeetingController,
  togglePinMeetingController,
  toggleWorkspaceActionItemController,
} from "../controllers/workspace.controller.js";

const router = express.Router();

router.get("/overview", authenticate, getWorkspaceOverviewController);
router.patch("/meetings/:meetingId/favorite", authenticate, toggleFavoriteMeetingController);
router.patch("/meetings/:meetingId/pin", authenticate, togglePinMeetingController);
router.patch("/action-items/:meetingId/:itemIndex", authenticate, toggleWorkspaceActionItemController);

export default router;
