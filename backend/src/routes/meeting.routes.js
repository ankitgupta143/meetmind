import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { getMeetingByIdController, getMeetingsController } from "../controllers/meeting.controller.js";
import { getMeetingTranscriptController } from "../controllers/transcript.controller.js";

const router = express.Router();

router.get("/", authenticate, getMeetingsController);
router.get("/:id", authenticate, getMeetingByIdController);
router.get("/:id/transcript", authenticate, getMeetingTranscriptController);

export default router;