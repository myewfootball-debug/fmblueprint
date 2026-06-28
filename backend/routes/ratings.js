const express = require("express");
const router = express.Router();
const Tactic = require("../models/Tactic");
const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Get ratings for a tactic
router.get("/:tacticId", async (req, res) => {
  try {
    const tactic = await Tactic.findById(req.params.tacticId);
    if (!tactic) {
      return res.status(404).json({ error: "Tactic not found" });
    }
    
    res.json({
      average: tactic.ratings?.average || 0,
      count: tactic.ratings?.count || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rate a tactic (1-5 stars)
router.post("/:tacticId", authenticate, async (req, res) => {
  try {
    const { rating } = req.body;
    const tactic = await Tactic.findById(req.params.tacticId);
    
    if (!tactic) {
      return res.status(404).json({ error: "Tactic not found" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    // Initialize ratings if it doesn't exist
    if (!tactic.ratings) {
      tactic.ratings = { total: 0, count: 0, average: 0, users: [] };
    }

    // Check if user already rated
    const existingRatingIndex = tactic.ratings.users?.findIndex(
      r => r.userId && r.userId.toString() === req.userId
    );

    if (existingRatingIndex !== undefined && existingRatingIndex !== -1) {
      // Update existing rating
      const oldRating = tactic.ratings.users[existingRatingIndex].rating;
      tactic.ratings.total = tactic.ratings.total - oldRating + rating;
      tactic.ratings.users[existingRatingIndex].rating = rating;
    } else {
      // New rating
      if (!tactic.ratings.users) {
        tactic.ratings.users = [];
      }
      tactic.ratings.users.push({ userId: req.userId, rating });
      tactic.ratings.total += rating;
      tactic.ratings.count += 1;
    }

    tactic.ratings.average = tactic.ratings.total / tactic.ratings.count;
    await tactic.save();

    res.json({
      average: tactic.ratings.average,
      count: tactic.ratings.count,
      userRating: rating
    });
  } catch (error) {
    console.error("Rating error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
