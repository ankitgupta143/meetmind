import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  getIntegrationsController,
  connectIntegrationController,
  disconnectIntegrationController,
  syncIntegrationController,
  updateIntegrationConfigController,
  postMeetingToSlackController,
  importGoogleMeetMeetingController,
  syncMeetingTasksController,
} from "../controllers/integration.controller.js";

const router = express.Router();

router.get("/", authenticate, getIntegrationsController);
router.post("/slack/post-meeting", authenticate, postMeetingToSlackController);
router.post("/google-meet/import", authenticate, importGoogleMeetMeetingController);
router.patch("/:provider/config", authenticate, updateIntegrationConfigController);
router.post("/:provider/connect", authenticate, connectIntegrationController);
router.post("/:provider/disconnect", authenticate, disconnectIntegrationController);
router.post("/:provider/sync", authenticate, syncIntegrationController);
router.post("/:provider/sync-tasks", authenticate, syncMeetingTasksController);

export default router;
