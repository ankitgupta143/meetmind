import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import meetingRoutes from "./routes/meeting.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
}));

app.use(express.json({limit: "1mb"}));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "MeetMind API is running",
    });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/meetings", meetingRoutes);
app.use(errorHandler);

export default app;