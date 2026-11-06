import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { globalAssistantController } from "../controllers/globalAssistant.controller.js";

const router = express.Router();

router.post("/chat", authenticate, globalAssistantController);

export default router;