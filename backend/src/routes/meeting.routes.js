import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  createMeetingController,
  deleteMeetingController,
  getDashboardStatsController,
  getMeetingByIdController,
  getMeetingInsightsController,
  getMeetingsController,
  meetingAssistantController,
  testMeetingInsightsController,
  testTranscriptionController,
  updateMeetingController,
} from "../controllers/meeting.controller.js";
import { getMeetingTranscriptController } from "../controllers/transcript.controller.js";
import meetingUpload from "../middlewares/meetingUpload.js";
import { validate } from "../middlewares/validate.middleware.js";
import { updateMeetingSchema, assistantMessageSchema } from "../validators/meeting.validator.js";
import {
  updateActionItemController,
  createActionItemController,
  deleteActionItemController,
} from "../controllers/actionItem.controller.js";
import {
  deleteMeetingDecisionController,
  getMeetingDecisionsController,
  updateMeetingDecisionController,
  createMeetingDecisionController,
} from "../controllers/decision.controller.js";
import { diarizeMeetingController } from "../controllers/diarization.controller.js";
import {
  applyTranscriptDiarizationController,
  previewTranscriptDiarizationController,
} from "../controllers/transcriptDiarization.controller.js";
import { exportMeetingController } from "../controllers/meetingExport.controller.js";
import { updateMeetingSpeakersController } from "../controllers/meetingSpeaker.controller.js";
import { aiRateLimiter } from "../middlewares/rateLimit.middleware.js";

const router = express.Router();

router.get("/", authenticate, getMeetingsController);
router.get("/stats", authenticate, getDashboardStatsController);
router.get("/dashboard/stats", authenticate, getDashboardStatsController);
router.get("/:id", authenticate, getMeetingByIdController);
router.patch(
  "/:id",
  authenticate,
  validate(updateMeetingSchema),
  updateMeetingController,
);
router.delete("/:id", authenticate, deleteMeetingController);
router.get("/:id/transcript", authenticate, getMeetingTranscriptController);
router.get("/:id/insights", authenticate, getMeetingInsightsController);
router.post(
  "/",
  authenticate,
  meetingUpload.single("recording"),
  createMeetingController,
);
// Manual test endpoints: restricted strictly to development environments
if (process.env.NODE_ENV === "development") {
  router.post("/:id/transcribe", authenticate, testTranscriptionController);
  router.post("/:id/insights", authenticate, testMeetingInsightsController);
}

router.post(
  "/:id/assistant",
  authenticate,
  aiRateLimiter,
  validate(assistantMessageSchema),
  meetingAssistantController
);

router.post(
  "/:meetingId/action-items",
  authenticate,
  createActionItemController,
);

router.patch(
  "/:meetingId/action-items/:itemIndex",
  authenticate,
  updateActionItemController,
);

router.delete(
  "/:meetingId/action-items/:itemIndex",
  authenticate,
  deleteActionItemController,
);

router.get("/:id/decisions", authenticate, getMeetingDecisionsController);

router.post(
  "/:meetingId/decisions",
  authenticate,
  createMeetingDecisionController,
);

router.patch(
  "/:meetingId/decisions/:index",
  authenticate,
  updateMeetingDecisionController,
);

router.delete("/:meetingId/decisions/:index", authenticate, deleteMeetingDecisionController);

router.post("/:meetingId/diarize", authenticate, diarizeMeetingController);

router.post("/:meetingId/diarize-preview", authenticate, previewTranscriptDiarizationController);

router.post("/:meetingId/diarize-apply", authenticate, applyTranscriptDiarizationController);

router.post("/:meetingId/export", authenticate, exportMeetingController);

router.patch("/:meetingId/speakers", authenticate, updateMeetingSpeakersController);

export default router;
