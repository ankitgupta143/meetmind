import { Router } from "express";

import {
  registerController,
  loginController,
  refreshController,
  logoutController,
  forgotPasswordController,
  resetPasswordController,
  verifyEmailController,
  resendVerificationController,
  googleInitController,
  googleCallbackController,
  githubInitController,
  githubCallbackController,
} from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  resendVerificationSchema,
} from "../validators/auth.validator.js";
import { authRateLimiter } from "../middlewares/rateLimit.middleware.js";

const router = Router();

router.post("/register", authRateLimiter, validate(registerSchema), registerController);
router.post("/login", authRateLimiter, validate(loginSchema), loginController);
router.post("/refresh", authRateLimiter, refreshController);
router.post("/logout", logoutController);
router.post("/forgot-password", authRateLimiter, validate(forgotPasswordSchema), forgotPasswordController);
router.post("/reset-password", authRateLimiter, validate(resetPasswordSchema), resetPasswordController);
router.post("/verify-email", validate(verifyEmailSchema), verifyEmailController);
router.post("/resend-verification", authRateLimiter, validate(resendVerificationSchema), resendVerificationController);

// OAuth Routes (Google & GitHub)
router.get("/google", googleInitController);
router.get("/google/callback", googleCallbackController);
router.get("/github", githubInitController);
router.get("/github/callback", githubCallbackController);

export default router;
