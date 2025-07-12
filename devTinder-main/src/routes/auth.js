const express = require('express');
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user"); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { logActivity, logUserActivity } = require("../middlewares/activityLogger"); 

authRouter.post("/signup", async (req, res) => {
  try {
    // Validation of data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    // Encrypting the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Creating a new instance of the User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000), // 8 hours
    });

    // Log account creation
    await logUserActivity(savedUser._id, "account_creation", "User account created");
    
    res.json({ message : "User Added Successfully !", data: savedUser});
  } catch (err) {
    res.status(400).send("Error saving the user:" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    // Check if user is banned
    if (user.isBanned) {
      return res.status(403).json({
        success: false,
        message: "Your account has been banned. Reason: " + (user.banReason || "Policy violation"),
        bannedAt: user.bannedAt
      });
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      // Create a JWT token
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires : new Date(Date.now() + 8 * 3600000),
      });

      // Log login activity
      await logUserActivity(user._id, "login", "User logged in", {
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent')
      });

      res.send(user);
    } else {
      throw new Error("Password is not correct");
    }
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
    try {
        // Extract user info from token before clearing it
        const { token } = req.cookies;
        if (token) {
            const decodedObj = jwt.verify(token, "DEV@Tinder0459");
            const { _id } = decodedObj;
            
            // Log logout activity
            await logUserActivity(_id, "logout", "User logged out");
        }
        
        res.cookie("token", null , {
            expires : new Date(Date.now()),
        });
        res.send("Logout Successful");
    } catch (err) {
        // Even if logging fails, proceed with logout
        res.cookie("token", null , {
            expires : new Date(Date.now()),
        });
        res.send("Logout Successful");
    }
});


module.exports = authRouter;