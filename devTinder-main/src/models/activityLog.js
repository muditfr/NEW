const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: [
        "login",
        "logout",
        "profile_update",
        "connection_request",
        "skill_update",
        "password_change",
        "profile_view",
        "report_submitted",
        "admin_action",
        "account_creation"
      ],
      required: true,
    },
    details: {
      type: String,
      default: null,
    },
    targetUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    ipAddress: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

activityLogSchema.index({ userId: 1, createdAt: -1 });
activityLogSchema.index({ action: 1 });
activityLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model("ActivityLog", activityLogSchema);