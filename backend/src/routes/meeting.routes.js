import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  createMeetingController,
  getMeetingByIdController,
  getMeetingInsightsController,
  getMeetingsController,
  meetingAssistantController,
  testMeetingInsightsController,
  testTranscriptionController,
} from "../controllers/meeting.controller.js";
import { getMeetingTranscriptController } from "../controllers/transcript.controller.js";
import meetingUpload from "../middlewares/meetingUpload.js";
import { updateActionItemController } from "../controllers/actionItem.controller.js";
import {
  deleteMeetingDecisionController,
  getMeetingDecisionsController,
  updateMeetingDecisionController,
} from "../controllers/decision.controller.js";
import { diarizeMeetingController } from "../controllers/diarization.controller.js";
import { applyTranscriptDiarizationController, previewTranscriptDiarizationController } from "../controllers/transcriptDiarization.controller.js";

const router = express.Router();

router.get("/", authenticate, getMeetingsController);
router.get("/:id", authenticate, getMeetingByIdController);
router.get("/:id/transcript", authenticate, getMeetingTranscriptController);
router.get("/:id/insights", authenticate, getMeetingInsightsController);
router.post(
  "/",
  authenticate,
  meetingUpload.single("recording"),
  createMeetingController,
);
router.post("/:id/transcribe", authenticate, testTranscriptionController);
router.post("/:id/insights", authenticate, testMeetingInsightsController);

router.post("/:id/assistant", authenticate, meetingAssistantController);

router.patch(
  "/:meetingId/action-items/:itemIndex",
  authenticate,
  updateActionItemController,
);

router.get("/:id/decisions", authenticate, getMeetingDecisionsController);

router.patch(
  "/:meetingId/decisions/:index",
  authenticate,
  updateMeetingDecisionController,
);

router.delete("/:meetingId/decisions/:index", authenticate, deleteMeetingDecisionController);

router.post("/:meetingId/diarize", authenticate, diarizeMeetingController);

router.post("/:meetingId/diarize-preview", authenticate, previewTranscriptDiarizationController);

router.post("/:meetingId/diarize-apply", authenticate, applyTranscriptDiarizationController);
export default router;
