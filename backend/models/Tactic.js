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
  images: [{ type: String }],
  // Ratings system
  ratings: {
    total: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
    average: { type: Number, default: 0 }
  },
  // Favorites - stored as array of user IDs
  favoritedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

module.exports = mongoose.model("Tactic", tacticSchema);