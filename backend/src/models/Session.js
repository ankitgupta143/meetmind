import mongoose from "mongoose";

const { Schema } = mongoose;

const sessionSchema = new Schema(
  {
    // ─────────────────────────────
    // User relationship
    // ─────────────────────────────

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },

    // ─────────────────────────────
    // Refresh token
    // ─────────────────────────────

    tokenHash: {
      type: String,
      required: [true, "Token hash is required"],
      unique: true,
      select: false,
    },

    // ─────────────────────────────
    // Session lifecycle
    // ─────────────────────────────

    expiresAt: {
      type: Date,
      required: [true, "Session expiration is required"],
      index: true,
    },

    revokedAt: {
      type: Date,
      default: null,
    },

    revokeReason: {
      type: String,
      enum: [
        "logout",
        "token-rotation",
        "security",
        "expired",
        "password-change",
        "admin",
      ],
      default: null,
    },

    // ─────────────────────────────
    // Refresh token rotation
    // ─────────────────────────────

    replacedBySessionId: {
      type: Schema.Types.ObjectId,
      ref: "Session",
      default: null,
    },

    // ─────────────────────────────
    // Device information
    // ─────────────────────────────

    userAgent: {
      type: String,
      default: null,
      maxlength: 1000,
    },

    ipAddress: {
      type: String,
      default: null,
      maxlength: 100,
    },

    // ─────────────────────────────
    // Activity
    // ─────────────────────────────

    lastUsedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Automatically remove expired sessions
sessionSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;