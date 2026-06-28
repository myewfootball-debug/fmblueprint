const express = require("express");
const router = express.Router();
const Tactic = require("../models/Tactic");

// GET all tactics
router.get("/", async (req, res) => {
  try {
    const tactics = await Tactic.find();
    res.json(tactics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET a single tactic by ID
router.get("/:id", async (req, res) => {
  try {
    const tactic = await Tactic.findById(req.params.id);
    if (!tactic) {
      return res.status(404).json({ error: "Tactic not found" });
    }
    res.json(tactic);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST a new tactic
router.post("/", async (req, res) => {
  try {
    const tactic = new Tactic(req.body);
    await tactic.save();
    res.status(201).json(tactic);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;