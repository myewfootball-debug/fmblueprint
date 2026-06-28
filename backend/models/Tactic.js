const mongoose = require("mongoose");

const tacticSchema = new mongoose.Schema({
  name: { type: String, required: true },
  formation: { type: String, required: true },
  description: { type: String, required: true },
  isPremium: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  filename: { type: String },
  fileUrl: { type: String },
  downloads: { type: Number, default: 0 },
  author: { type: String },
  // New fields for images
  images: [{ type: String }], // Array of image URLs
  comments: [{
    user: { type: String, required: true },
    userId: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model("Tactic", tacticSchema);