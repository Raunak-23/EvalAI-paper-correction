const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");
const cors = require("cors");
require("dotenv").config();

// middelware to verufy JWT
const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }
  const token = authHeader.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. Malformed token.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ success: false, message: 'Invalid token.' });
  }
};

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Import User model
const User = require("./models/User");

// ✅ Test route
app.get("/", (req, res) => res.send("Backend is running 🚀"));

// ✅ Register
app.post("/api/auth/register",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("firstName").notEmpty(),
    body("lastName").notEmpty(),
    body("role").isIn(["teacher", "student"]),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ success: false, errors: errors.array() });

      const { email, password, firstName, lastName, role, department, grade } = req.body;

      const existing = await User.findOne({ email });
      if (existing)
        return res.status(409).json({
          success: false,
          message: "Email already registered"
        });

      const user = new User({
        email,
        password,
        firstName,
        lastName,
        role,
        department,
        grade,
        teacherId: role === "teacher" ? `TCH${Date.now()}` : undefined,
        studentId: role === "student" ? `STU${Date.now()}` : undefined,
      });

      await user.save();

      const token = user.generateAuthToken();

      res.json({ success: true, data: { user, token } });
    } catch (err) {
      console.error("Register error:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

// ✅ Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    const valid = await user.comparePassword(password);
    if (!valid)
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = user.generateAuthToken();

    res.json({ success: true, data: { user, token } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Update User profile
app.put("/api/auth/user", authMiddleware, async (req, res) => {
  try {
    const { email } = req.body;
    const userId = req.user.id; // Get user ID from auth middleware

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser && existingUser._id.toString() !== userId) {
      return res.status(409).json({ success: false, message: "Email already in use" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.email = email;
    await user.save();

    const userResponse = await User.findById(userId).select("-password");

    res.json({ success: true, data: { user: userResponse } });
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Serve static files (production only)
const path = require("path");
const buildPath = path.join(__dirname, "..", "client", "build");
console.log('[STATIC] serving from', path.join(__dirname, '../client/build'));
app.use(express.static(buildPath, { dotfiles: "allow" }));

app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"), {}, (err) => {
    if (err) res.status(500).send(`<pre>STATIC ERR: ${err.message}\nPath: ${buildPath}</pre>`);
  });
});

// ✅ Connect MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ DB error:", err));

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
