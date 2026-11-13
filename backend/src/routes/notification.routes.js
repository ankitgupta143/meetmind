import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  deleteNotificationController,
  getNotificationsController,
  markAllNotificationsAsReadController,
  markNotificationAsReadController,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.use(authenticate);

router.get("/", getNotificationsController);
router.patch("/read-all", markAllNotificationsAsReadController);
router.patch("/:id/read", markNotificationAsReadController);
router.delete("/:id", deleteNotificationController);

export default router;
