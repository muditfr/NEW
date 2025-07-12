const mongoose = require("mongoose");
const User = require("../src/models/user");
const bcrypt = require("bcrypt");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/devTinder", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const createAdmin = async () => {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ emailId: "admin@devtinder.com" });
    if (existingAdmin) {
      console.log("Admin user already exists!");
      process.exit(0);
    }

    // Create admin user
    const passwordHash = await bcrypt.hash("Admin@123", 10);
    
    const admin = new User({
      firstName: "Admin",
      lastName: "User",
      emailId: "admin@devtinder.com",
      password: passwordHash,
      age: 30,
      gender: "others",
      photoUrl: "https://via.placeholder.com/150",
      about: "Administrator account for DevTinder platform",
      skills: ["Platform Management", "User Moderation", "Content Review"],
      isAdmin: true
    });

    await admin.save();
    console.log("Admin user created successfully!");
    console.log("Email: admin@devtinder.com");
    console.log("Password: Admin@123");
    
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
};

createAdmin();