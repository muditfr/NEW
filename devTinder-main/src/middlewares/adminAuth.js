const adminAuth = async (req, res, next) => {
  try {
    // Check if user is authenticated (userAuth middleware should run first)
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required" 
      });
    }

    // Check if user is an admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: "Admin access required" 
      });
    }

    // Check if admin is not banned
    if (req.user.isBanned) {
      return res.status(403).json({ 
        success: false, 
        message: "Admin account is banned" 
      });
    }

    next();
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: "Internal server error: " + err.message 
    });
  }
};

module.exports = { adminAuth };