console.log("🔥 SERVER START FILE LOADED");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.url}`);
  next();
});

// Serve uploaded files statically
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
const tacticRoutes = require("./routes/tactics");
const authRoutes = require("./routes/auth");
const uploadRoutes = require("./routes/upload");

// Use routes
app.use("/api/tactics", tacticRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is working");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

// MongoDB connection - FIXED VERSION
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});