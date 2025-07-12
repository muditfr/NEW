const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const Report = require("../models/report");
const SystemMessage = require("../models/systemMessage");
const ActivityLog = require("../models/activityLog");
const { logUserActivity } = require("../middlewares/activityLogger");

// User Management Functions
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({})
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments({});

    res.json({
      success: true,
      data: {
        users,
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
      message: "Error fetching users: " + err.message
    });
  }
};

const banUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Ban reason is required"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.isAdmin) {
      return res.status(400).json({
        success: false,
        message: "Cannot ban admin users"
      });
    }

    user.isBanned = true;
    user.banReason = reason;
    user.bannedAt = new Date();
    user.bannedBy = req.user._id;

    await user.save();

    // Log admin action
    await logUserActivity(req.user._id, "admin_action", `Banned user ${user.firstName} ${user.lastName}`, {
      targetUserId: userId,
      action: "ban",
      reason
    });

    res.json({
      success: true,
      message: "User banned successfully",
      data: {
        userId: user._id,
        bannedAt: user.bannedAt,
        reason: user.banReason
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error banning user: " + err.message
    });
  }
};

const unbanUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    user.isBanned = false;
    user.banReason = null;
    user.bannedAt = null;
    user.bannedBy = null;

    await user.save();

    // Log admin action
    await logUserActivity(req.user._id, "admin_action", `Unbanned user ${user.firstName} ${user.lastName}`, {
      targetUserId: userId,
      action: "unban"
    });

    res.json({
      success: true,
      message: "User unbanned successfully",
      data: {
        userId: user._id
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error unbanning user: " + err.message
    });
  }
};

// Content Moderation Functions
const getAllReports = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status || 'all';

    const filter = status === 'all' ? {} : { status };

    const reports = await Report.find(filter)
      .populate('reportedUserId', 'firstName lastName emailId skills')
      .populate('reportedByUserId', 'firstName lastName emailId')
      .populate('reviewedBy', 'firstName lastName')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Report.countDocuments(filter);

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
};

const resolveReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { action, adminNotes } = req.body;

    if (!['resolved', 'dismissed'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Invalid action. Must be 'resolved' or 'dismissed'"
      });
    }

    const report = await Report.findById(reportId)
      .populate('reportedUserId', 'firstName lastName emailId skills');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found"
      });
    }

    report.status = action;
    report.reviewedBy = req.user._id;
    report.reviewedAt = new Date();
    report.adminNotes = adminNotes || '';

    await report.save();

    // Log admin action
    await logUserActivity(req.user._id, "admin_action", `${action} report for ${report.reportedUserId.firstName}`, {
      reportId: reportId,
      action: action,
      notes: adminNotes
    });

    res.json({
      success: true,
      message: `Report ${action} successfully`,
      data: report
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error resolving report: " + err.message
    });
  }
};

const rejectSkillDescription = async (req, res) => {
  try {
    const { userId } = req.params;
    const { rejectedSkills, reason } = req.body;

    if (!rejectedSkills || !Array.isArray(rejectedSkills)) {
      return res.status(400).json({
        success: false,
        message: "Rejected skills array is required"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Remove rejected skills from user's skills array
    user.skills = user.skills.filter(skill => !rejectedSkills.includes(skill));
    await user.save();

    // Log admin action
    await logUserActivity(req.user._id, "admin_action", `Rejected skills for ${user.firstName} ${user.lastName}`, {
      targetUserId: userId,
      rejectedSkills,
      reason
    });

    res.json({
      success: true,
      message: "Skills rejected successfully",
      data: {
        userId: user._id,
        rejectedSkills,
        remainingSkills: user.skills
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error rejecting skills: " + err.message
    });
  }
};

// Swap Monitoring Functions
const getAllSwaps = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status || 'all';

    const filter = status === 'all' ? {} : { status };

    const swaps = await ConnectionRequest.find(filter)
      .populate('fromUserId', 'firstName lastName emailId skills')
      .populate('toUserId', 'firstName lastName emailId skills')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await ConnectionRequest.countDocuments(filter);

    res.json({
      success: true,
      data: {
        swaps,
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
      message: "Error fetching swaps: " + err.message
    });
  }
};

const getSwapStats = async (req, res) => {
  try {
    const stats = await ConnectionRequest.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const totalUsers = await User.countDocuments({});
    const totalSwaps = await ConnectionRequest.countDocuments({});
    const bannedUsers = await User.countDocuments({ isBanned: true });

    // Get recent activity
    const recentActivity = await ActivityLog.find({})
      .populate('userId', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        swapStats: stats,
        totalUsers,
        totalSwaps,
        bannedUsers,
        recentActivity
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching swap stats: " + err.message
    });
  }
};

// Communication Functions
const sendBroadcastMessage = async (req, res) => {
  try {
    const { title, message, type, priority, expiresAt } = req.body;

    if (!title || !message || !type) {
      return res.status(400).json({
        success: false,
        message: "Title, message, and type are required"
      });
    }

    const systemMessage = new SystemMessage({
      title,
      message,
      type,
      priority: priority || 'medium',
      createdBy: req.user._id,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      isGlobal: true
    });

    await systemMessage.save();

    // Log admin action
    await logUserActivity(req.user._id, "admin_action", `Sent broadcast message: ${title}`, {
      messageId: systemMessage._id,
      type,
      priority
    });

    res.json({
      success: true,
      message: "Broadcast message sent successfully",
      data: systemMessage
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error sending broadcast message: " + err.message
    });
  }
};

const getAllSystemMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const messages = await SystemMessage.find({})
      .populate('createdBy', 'firstName lastName')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await SystemMessage.countDocuments({});

    res.json({
      success: true,
      data: {
        messages,
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
      message: "Error fetching system messages: " + err.message
    });
  }
};

const updateSystemMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const updates = req.body;

    const message = await SystemMessage.findByIdAndUpdate(
      messageId,
      updates,
      { new: true }
    ).populate('createdBy', 'firstName lastName');

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "System message not found"
      });
    }

    res.json({
      success: true,
      message: "System message updated successfully",
      data: message
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error updating system message: " + err.message
    });
  }
};

const deleteSystemMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await SystemMessage.findByIdAndDelete(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "System message not found"
      });
    }

    res.json({
      success: true,
      message: "System message deleted successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error deleting system message: " + err.message
    });
  }
};

// Reporting Functions
const getUserActivityReport = async (req, res) => {
  try {
    const { startDate, endDate, userId } = req.query;
    
    const filter = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    if (userId) filter.userId = userId;

    const activities = await ActivityLog.find(filter)
      .populate('userId', 'firstName lastName emailId')
      .sort({ createdAt: -1 })
      .limit(1000);

    res.json({
      success: true,
      data: {
        activities,
        count: activities.length
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error generating activity report: " + err.message
    });
  }
};

const getFeedbackReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const filter = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const reports = await Report.find(filter)
      .populate('reportedUserId', 'firstName lastName emailId')
      .populate('reportedByUserId', 'firstName lastName emailId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        reports,
        count: reports.length
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error generating feedback report: " + err.message
    });
  }
};

const exportReports = async (req, res) => {
  try {
    const { type, format } = req.query;

    let data = {};
    
    if (type === 'users' || !type) {
      data.users = await User.find({}).select('-password');
    }
    
    if (type === 'swaps' || !type) {
      data.swaps = await ConnectionRequest.find({})
        .populate('fromUserId', 'firstName lastName emailId')
        .populate('toUserId', 'firstName lastName emailId');
    }
    
    if (type === 'reports' || !type) {
      data.reports = await Report.find({})
        .populate('reportedUserId', 'firstName lastName emailId')
        .populate('reportedByUserId', 'firstName lastName emailId');
    }

    if (type === 'activities' || !type) {
      data.activities = await ActivityLog.find({})
        .populate('userId', 'firstName lastName emailId')
        .limit(5000);
    }

    // For now, return JSON format
    // In production, you might want to add CSV/PDF export functionality
    res.json({
      success: true,
      data,
      exportedAt: new Date()
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error exporting reports: " + err.message
    });
  }
};

module.exports = {
  getAllUsers,
  banUser,
  unbanUser,
  getAllReports,
  resolveReport,
  rejectSkillDescription,
  getAllSwaps,
  getSwapStats,
  sendBroadcastMessage,
  getAllSystemMessages,
  updateSystemMessage,
  deleteSystemMessage,
  getUserActivityReport,
  getFeedbackReport,
  exportReports
};