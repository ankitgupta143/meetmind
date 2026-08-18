import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    // ─────────────────────────────
    // Identity
    // ─────────────────────────────

    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },

    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [254, "Email cannot exceed 254 characters"],
    },

    // ─────────────────────────────
    // Authentication
    // ─────────────────────────────

    passwordHash: {
      type: String,
      select: false,
      required: function () {
        return this.authProvider === "local";
      },
    },

    authProvider: {
      type: String,
      enum: ["local", "google", "github"],
      default: "local",
    },

    emailVerifiedAt: {
      type: Date,
      default: null,
    },

    // ─────────────────────────────
    // Account
    // ─────────────────────────────

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    status: {
      type: String,
      enum: ["active", "suspended", "deleted"],
      default: "active",
    },

    onboardingCompleted: {
      type: Boolean,
      default: false,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },

    deletedAt: {
      type: Date,
      default: null,
    },

    // ─────────────────────────────
    // Profile
    // ─────────────────────────────

    profile: {
      phone: {
        type: String,
        trim: true,
        default: null,
        maxlength: [30, "Phone number cannot exceed 30 characters"],
      },

      company: {
        type: String,
        trim: true,
        default: null,
        maxlength: [100, "Company name cannot exceed 100 characters"],
      },

      jobTitle: {
        type: String,
        trim: true,
        default: null,
        maxlength: [100, "Job title cannot exceed 100 characters"],
      },

      country: {
        type: String,
        trim: true,
        default: null,
        maxlength: [100, "Country cannot exceed 100 characters"],
      },
    },

    avatar: {
      url: {
        type: String,
        default: null,
      },

      publicId: {
        type: String,
        default: null,
      },
    },

    // ─────────────────────────────
    // User Settings
    // ─────────────────────────────

    settings: {
      appearance: {
        theme: {
          type: String,
          enum: ["light", "dark", "system"],
          default: "system",
        },

        accentColor: {
          type: String,
          default: "indigo",
        },

        animations: {
          type: Boolean,
          default: true,
        },
      },

      localization: {
        language: {
          type: String,
          default: "en",
        },

        timezone: {
          type: String,
          default: "UTC",
        },
      },

      notifications: {
        email: {
          type: Boolean,
          default: true,
        },

        push: {
          type: Boolean,
          default: true,
        },

        inApp: {
          type: Boolean,
          default: true,
        },

        meetingReady: {
          type: Boolean,
          default: true,
        },

        mentions: {
          type: Boolean,
          default: true,
        },

        weeklyDigest: {
          type: Boolean,
          default: true,
        },
      },

      ai: {
        model: {
          type: String,
          default: "gemini-flash",
        },

        summaryStyle: {
          type: String,
          enum: ["short", "balanced", "detailed"],
          default: "balanced",
        },

        responseTone: {
          type: String,
          enum: ["professional", "friendly", "concise"],
          default: "professional",
        },

        autoSummary: {
          type: Boolean,
          default: true,
        },

        autoActionItems: {
          type: Boolean,
          default: true,
        },

        autoDecisions: {
          type: Boolean,
          default: true,
        },

        autoAnalytics: {
          type: Boolean,
          default: true,
        },
      },
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
