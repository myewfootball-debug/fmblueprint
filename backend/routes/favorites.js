const express = require("express");
const router = express.Router();
const Favorite = require("../models/Favorite");
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

// Get user's favorites
router.get("/", authenticate, async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.userId })
      .populate("tacticId");
    res.json(favorites.map(f => f.tacticId));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add favorite
router.post("/:tacticId", authenticate, async (req, res) => {
  try {
    const tactic = await Tactic.findById(req.params.tacticId);
    if (!tactic) {
      return res.status(404).json({ error: "Tactic not found" });
    }

    // Check if already favorited
    const existing = await Favorite.findOne({
      userId: req.userId,
      tacticId: req.params.tacticId
    });

    if (existing) {
      return res.status(400).json({ error: "Already in favorites" });
    }

    const favorite = new Favorite({
      userId: req.userId,
      tacticId: req.params.tacticId
    });
    await favorite.save();

    res.json({ message: "Added to favorites" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove favorite
router.delete("/:tacticId", authenticate, async (req, res) => {
  try {
    const result = await Favorite.findOneAndDelete({
      userId: req.userId,
      tacticId: req.params.tacticId
    });

    if (!result) {
      return res.status(404).json({ error: "Favorite not found" });
    }

    res.json({ message: "Removed from favorites" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
