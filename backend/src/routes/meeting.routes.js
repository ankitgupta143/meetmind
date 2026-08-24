import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { createMeetingController, getMeetingByIdController, getMeetingsController, testTranscriptionController } from "../controllers/meeting.controller.js";
import { getMeetingTranscriptController } from "../controllers/transcript.controller.js";
import meetingUpload from "../middlewares/meetingUpload.js";

const router = express.Router();

router.get("/", authenticate, getMeetingsController);
router.get("/:id", authenticate, getMeetingByIdController);
router.get("/:id/transcript", authenticate, getMeetingTranscriptController);
router.post("/", authenticate, meetingUpload.single("recording"), createMeetingController);
router.post(
  "/:id/transcribe",
  authenticate,
  testTranscriptionController
);

export default router;