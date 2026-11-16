import { Router } from "express";

import {
  getCurrentUserController,
  removeAvatarController,
  updateCurrentUserController,
  updateSettingsController,
  uploadAvatarController,
} from "../controllers/user.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";

import { validate } from "../middlewares/validate.middleware.js";

import {
  updateProfileSchema,
  updateSettingsSchema,
} from "../validators/user.validator.js";
import upload from "../middlewares/upload.js";

const router = Router();

router.get("/me", authenticate, getCurrentUserController);

router.patch(
  "/me",
  authenticate,
  validate(updateProfileSchema),
  updateCurrentUserController,
);

router.patch(
  "/me/settings",
  authenticate,
  validate(updateSettingsSchema),
  updateSettingsController,
);

router.post("/me/avatar", authenticate, upload.single("avatar"), uploadAvatarController);
router.delete("/me/avatar", authenticate, removeAvatarController);

export default router;
