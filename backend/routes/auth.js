const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get("/test", (req, res) => {
  res.json({ message: "Auth routes are working!" });
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("📝 Registration attempt:", { name, email });
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = new User({ 
      name, 
      email, 
      password: hashedPassword 
    });
    await user.save();
    console.log("✅ User created:", user._id);

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("📝 Login attempt:", { email });
    
    const user = await User.findOne({ email });
    console.log("👤 User found:", user ? "Yes" : "No");
    
    if (!user) {
      console.log("❌ User not found");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("✅ Password match:", isMatch);
    
    if (!isMatch) {
      console.log("❌ Password incorrect");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "7d" }
    );

    console.log("✅ Login successful for:", user.email);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
