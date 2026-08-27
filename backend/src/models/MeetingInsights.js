import mongoose from "mongoose";

const { Schema } = mongoose;

const actionItemSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Action item title is required"],
      trim: true,
      maxlength: 300,
    },

    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: 2000,
    },

    assignee: {
      type: String,
      trim: true,
      default: null,
      maxlength: 100,
    },

    dueDate: {
      type: Date,
      default: null,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
  },
  {
    _id: false,
  },
);

const decisionSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Decision title is required"],
      trim: true,
      maxlength: 300,
    },

    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: 2000,
    },

    owner: {
      type: String,
      trim: true,
      default: null,
      maxlength: 100,
    },
  },
  {
    _id: false,
  },
);

const riskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Risk title is required"],
      trim: true,
      maxlength: 300,
    },

    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: 2000,
    },

    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
  },
  {
    _id: false,
  },
);

const timelineItemSchema = new Schema(
  {
    timestamp: {
      type: Number,
      required: true,
      min: 0,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: 1000,
    },
  },
  {
    _id: false,
  },
);

const speakerStatSchema = new Schema(
  {
    speaker: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    talkTimeSeconds: {
      type: Number,
      min: 0,
      default: 0,
    },

    percentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
  },
  {
    _id: false,
  },
);

const topicSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    percentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
  },
  {
    _id: false,
  },
);

const meetingInsightsSchema = new Schema(
  {
    meetingId: {
      type: Schema.Types.ObjectId,
      ref: "Meeting",
      required: [true, "Meeting is required"],
      unique: true,
    },

    // AI processing information
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },

    provider: {
      type: String,
      default: "gemini",
    },

    model: {
      type: String,
      default: null,
    },

    processingError: {
      type: String,
      default: null,
      maxlength: 2000,
    },

    generatedAt: {
      type: Date,
      default: null,
    },

    // Summary
    summary: {
      overview: {
        type: String,
        default: "",
      },

      keyTakeaways: {
        type: [String],
        default: [],
      },
    },

    // Action items
    actionItems: {
      type: [actionItemSchema],
      default: [],
    },

    // Decisions
    decisions: {
      type: [decisionSchema],
      default: [],
    },

    // Risks
    risks: {
      type: [riskSchema],
      default: [],
    },

    // Timeline
    timeline: {
      type: [timelineItemSchema],
      default: [],
    },

    // Analytics
    analytics: {
      totalDurationSeconds: {
        type: Number,
        min: 0,
        default: 0,
      },

      messageCount: {
        type: Number,
        min: 0,
        default: 0,
      },

      wordCount: {
        type: Number,
        min: 0,
        default: 0,
      },

      totalTalkTimeSeconds: {
        type: Number,
        min: 0,
        default: 0,
      },

      speakerStats: {
        type: [speakerStatSchema],
        default: [],
      },

      sentiment: {
        overall: {
          type: String,
          enum: ["positive", "neutral", "negative"],
          default: "neutral",
        },

        score: {
          type: Number,
          min: -1,
          max: 1,
          default: 0,
        },
      },

      topics: {
        type: [topicSchema],
        default: [],
      },
    },
  },
  {
    timestamps: true,
  },
);

const MeetingInsights = mongoose.model(
  "MeetingInsights",
  meetingInsightsSchema,
);

export default MeetingInsights;
