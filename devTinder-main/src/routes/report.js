const express = require("express");
const reportRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { logActivity } = require("../middlewares/activityLogger");
const Report = require("../models/report");
const User = require("../models/user");
const SystemMessage = require("../models/systemMessage");

// Create a new report
reportRouter.post("/create", userAuth, logActivity("report_submitted", "Submitted a report"), async (req, res) => {
  try {
    const { reportedUserId, reportType, description } = req.body;

    // Validate input
    if (!reportedUserId || !reportType || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Check if reported user exists
    const reportedUser = await User.findById(reportedUserId);
    if (!reportedUser) {
      return res.status(404).json({
        success: false,
        message: "Reported user not found"
      });
    }

    // Check if user is trying to report themselves
    if (reportedUserId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot report yourself"
      });
    }

    // Check if user has already reported this user for the same type
    const existingReport = await Report.findOne({
      reportedUserId,
      reportedByUserId: req.user._id,
      reportType,
      status: { $in: ["pending", "reviewed"] }
    });

    if (existingReport) {
      return res.status(400).json({
        success: false,
        message: "You have already reported this user for this type of issue"
      });
    }

    // Create new report
    const report = new Report({
      reportedUserId,
      reportedByUserId: req.user._id,
      reportType,
      description: description.trim()
    });

    await report.save();

    res.json({
      success: true,
      message: "Report submitted successfully",
      data: {
        reportId: report._id,
        status: report.status
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error submitting report: " + err.message
    });
  }
});

// Get user's own reports
reportRouter.get("/my-reports", userAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reports = await Report.find({ reportedByUserId: req.user._id })
      .populate('reportedUserId', 'firstName lastName')
      .populate('reviewedBy', 'firstName lastName')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Report.countDocuments({ reportedByUserId: req.user._id });

    res.json({
      success: true,
      data: {
        reports,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching reports: " + err.message
    });
  }
});

// Get system messages for the user
reportRouter.get("/system-messages", userAuth, async (req, res) => {
  try {
    const messages = await SystemMessage.find({
      isActive: true,
      $or: [
        { isGlobal: true },
        { targetUsers: req.user._id }
      ],
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } }
      ]
    })
    .populate('createdBy', 'firstName lastName')
    .sort({ priority: 1, createdAt: -1 })
    .limit(5);

    res.json({
      success: true,
      data: messages
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching system messages: " + err.message
    });
  }
});

// Mark system message as read (optional feature)
reportRouter.post("/system-messages/:messageId/read", userAuth, async (req, res) => {
  try {
    const { messageId } = req.params;
    
    // This is a simple implementation - in production you might want to track
    // which users have read which messages
    res.json({
      success: true,
      message: "Message marked as read"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error marking message as read: " + err.message
    });
  }
});

module.exports = reportRouter;