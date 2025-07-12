const ActivityLog = require("../models/activityLog");

const logActivity = (action, details = null) => {
  return async (req, res, next) => {
    try {
      // Log the activity after the request is processed
      const originalSend = res.send;
      res.send = function(data) {
        // Only log if the request was successful
        if (res.statusCode < 400 && req.user) {
          const logData = {
            userId: req.user._id,
            action,
            details,
            targetUserId: req.params.toUserId || req.params.userId || null,
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent'),
            metadata: {
              statusCode: res.statusCode,
              method: req.method,
              path: req.path,
              params: req.params,
              body: action === 'login' ? null : req.body // Don't log sensitive login data
            }
          };

          // Save activity log asynchronously
          const activityLog = new ActivityLog(logData);
          activityLog.save().catch(err => {
            console.error('Error saving activity log:', err);
          });
        }
        
        originalSend.call(this, data);
      };

      next();
    } catch (err) {
      console.error('Activity logging error:', err);
      next(); // Continue even if logging fails
    }
  };
};

// Helper function to log activities manually
const logUserActivity = async (userId, action, details = null, metadata = null) => {
  try {
    const activityLog = new ActivityLog({
      userId,
      action,
      details,
      metadata
    });
    await activityLog.save();
  } catch (err) {
    console.error('Error logging user activity:', err);
  }
};

module.exports = { logActivity, logUserActivity };