const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const { logActivity, logUserActivity } = require("../middlewares/activityLogger");

profileRouter.get("/profile/view", userAuth, logActivity("profile_view", "Viewed own profile"), async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("User not found");
    }

    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }
    const loggedInUser = req.user;
    const updatedFields = Object.keys(req.body);

    Object.keys(req.body).forEach((key) =>
       (loggedInUser[key] = req.body[key])
   );
   await loggedInUser.save();

   // Log profile update activity
   await logUserActivity(loggedInUser._id, "profile_update", "Updated profile fields", {
     updatedFields: updatedFields,
     changes: req.body
   });

   res.json({
    message:`${loggedInUser.firstName}, your profile has been updated successfully`,
    data: loggedInUser,
   });

  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

module.exports = profileRouter;
