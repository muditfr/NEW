const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    reportedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reportedByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reportType: {
      type: String,
      enum: ["inappropriate_skills", "spam", "harassment", "other"],
      required: true,
    },
    description: {
      type: String,
      required: true,
      maxLength: 500,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved"],
      default: "pending",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    adminNotes: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.index({ reportedUserId: 1, reportedByUserId: 1 });
reportSchema.index({ status: 1 });

module.exports = mongoose.model("Report", reportSchema);