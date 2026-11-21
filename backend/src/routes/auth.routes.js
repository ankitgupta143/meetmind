import { Router } from "express";

import {
  registerController,
  loginController,
  refreshController,
  logoutController,
  forgotPasswordController,
  resetPasswordController,
} from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validators/auth.validator.js";
import { authRateLimiter } from "../middlewares/rateLimit.middleware.js";

const router = Router();

router.post("/register", authRateLimiter, validate(registerSchema), registerController);
router.post("/login", authRateLimiter, validate(loginSchema), loginController);
router.post("/refresh", authRateLimiter, refreshController);
router.post("/logout", logoutController);
router.post("/forgot-password", authRateLimiter, validate(forgotPasswordSchema), forgotPasswordController);
router.post("/reset-password", authRateLimiter, validate(resetPasswordSchema), resetPasswordController);

export default router;
