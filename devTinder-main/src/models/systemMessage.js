const mongoose = require("mongoose");

const systemMessageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxLength: 100,
    },
    message: {
      type: String,
      required: true,
      maxLength: 1000,
    },
    type: {
      type: String,
      enum: ["feature_update", "maintenance", "alert", "general"],
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    targetUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    // If empty, message is for all users
    isGlobal: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

systemMessageSchema.index({ isActive: 1, expiresAt: 1 });
systemMessageSchema.index({ type: 1 });

module.exports = mongoose.model("SystemMessage", systemMessageSchema);