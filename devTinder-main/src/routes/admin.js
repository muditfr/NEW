const express = require("express");
const adminRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { adminAuth } = require("../middlewares/adminAuth");
const { logActivity } = require("../middlewares/activityLogger");
const {
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
} = require("../controllers/adminController");

// All admin routes require both user authentication and admin authorization
adminRouter.use(userAuth, adminAuth);

// User Management Routes
adminRouter.get("/users", logActivity("admin_action", "Viewed users list"), getAllUsers);
adminRouter.post("/users/:userId/ban", logActivity("admin_action", "Banned user"), banUser);
adminRouter.post("/users/:userId/unban", logActivity("admin_action", "Unbanned user"), unbanUser);

// Content Moderation Routes
adminRouter.get("/reports", logActivity("admin_action", "Viewed reports"), getAllReports);
adminRouter.post("/reports/:reportId/resolve", logActivity("admin_action", "Resolved report"), resolveReport);
adminRouter.post("/skills/:userId/reject", logActivity("admin_action", "Rejected skills"), rejectSkillDescription);

// Swap Monitoring Routes
adminRouter.get("/swaps", logActivity("admin_action", "Viewed swaps"), getAllSwaps);
adminRouter.get("/swaps/stats", logActivity("admin_action", "Viewed swap stats"), getSwapStats);

// Communication Routes
adminRouter.post("/messages/broadcast", logActivity("admin_action", "Sent broadcast message"), sendBroadcastMessage);
adminRouter.get("/messages", logActivity("admin_action", "Viewed system messages"), getAllSystemMessages);
adminRouter.put("/messages/:messageId", logActivity("admin_action", "Updated system message"), updateSystemMessage);
adminRouter.delete("/messages/:messageId", logActivity("admin_action", "Deleted system message"), deleteSystemMessage);

// Reporting Routes
adminRouter.get("/reports/users", logActivity("admin_action", "Generated user activity report"), getUserActivityReport);
adminRouter.get("/reports/feedback", logActivity("admin_action", "Generated feedback report"), getFeedbackReport);
adminRouter.get("/reports/export", logActivity("admin_action", "Exported reports"), exportReports);

module.exports = adminRouter;