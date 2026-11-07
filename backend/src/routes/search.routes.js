import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { searchController } from "../controllers/search.controller.js";

const router = Router();

router.get("/", authenticate, searchController);

export default router;
