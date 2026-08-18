import { Router } from "express";

import {
  getCurrentUserController,
  updateCurrentUserController,
} from "../controllers/user.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";

import { validate } from "../middlewares/validate.middleware.js";

import { updateProfileSchema } from "../validators/user.validator.js";

const router = Router();

router.get("/me", authenticate, getCurrentUserController);

router.patch(
  "/me",
  authenticate,
  validate(updateProfileSchema),
  updateCurrentUserController,
);

export default router;
