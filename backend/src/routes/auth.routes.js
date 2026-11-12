import { Router } from "express";

import { registerController, loginController, refreshController, logoutController } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import { authRateLimiter } from "../middlewares/rateLimit.middleware.js";

const router = Router();

router.post("/register", authRateLimiter, validate(registerSchema), registerController);
router.post("/login", authRateLimiter, validate(loginSchema), loginController);
router.post("/refresh", authRateLimiter, refreshController);
router.post("/logout", logoutController);

export default router;
