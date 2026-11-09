import mongoose from "mongoose";

const { Schema } = mongoose;

const integrationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },

    provider: {
      type: String,
      required: [true, "Provider identifier is required"],
      trim: true,
      lowercase: true,
    },

    name: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["connected", "disconnected", "error"],
      default: "connected",
    },

    connectedAt: {
      type: Date,
      default: Date.now,
    },

    lastSyncAt: {
      type: Date,
      default: Date.now,
    },

    config: {
      type: Schema.Types.Mixed,
      default: () => ({
        autoSync: true,
        autoExport: false,
      }),
    },

    metadata: {
      type: Schema.Types.Mixed,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

// Enforce one unique record per user per provider
integrationSchema.index({ userId: 1, provider: 1 }, { unique: true });

const Integration = mongoose.model("Integration", integrationSchema);

export default Integration;
