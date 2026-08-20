import { Router } from "express";

import {
  getCurrentUserController,
  removeAvatarController,
  updateCurrentUserController,
  uploadAvatarController,
} from "../controllers/user.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";

import { validate } from "../middlewares/validate.middleware.js";

import { updateProfileSchema } from "../validators/user.validator.js";
import upload from "../middlewares/upload.js";

const router = Router();

router.get("/me", authenticate, getCurrentUserController);

router.patch(
  "/me",
  authenticate,
  validate(updateProfileSchema),
  updateCurrentUserController,
);

router.post("/me/avatar", authenticate, upload.single("avatar"), uploadAvatarController);
router.delete("/me/avatar", authenticate, removeAvatarController);

export default router;
