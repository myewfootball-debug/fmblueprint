const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Tactic = require("../models/Tactic");
const fs = require("fs");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
const imagesDir = path.join(__dirname, "../uploads/images");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Configure multer for tactic files (.fmf or .fmnf)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "image") {
      cb(null, imagesDir);
    } else {
      cb(null, uploadDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    if (file.fieldname === "image") {
      cb(null, "image-" + uniqueSuffix + path.extname(file.originalname));
    } else {
      // Keep the original extension (.fmf or .fmnf)
      const ext = path.extname(file.originalname);
      cb(null, "tactic-" + uniqueSuffix + ext);
    }
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "image") {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  } else {
    // Accept both .fmf and .fmnf files
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === ".fmf" || ext === ".fmnf") {
      cb(null, true);
    } else {
      cb(new Error("Only .fmf or .fmnf files are allowed"), false);
    }
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Upload tactic file
router.post("/tactic-file/:tacticId", upload.single("tacticFile"), async (req, res) => {
  try {
    const tactic = await Tactic.findById(req.params.tacticId);
    if (!tactic) {
      return res.status(404).json({ error: "Tactic not found" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    tactic.filename = req.file.filename;
    tactic.fileUrl = `/api/uploads/${req.file.filename}`;
    await tactic.save();

    res.json({
      message: "File uploaded successfully",
      filename: req.file.filename,
      fileUrl: tactic.fileUrl
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Upload tactic image
router.post("/image/:tacticId", upload.single("image"), async (req, res) => {
  try {
    const tactic = await Tactic.findById(req.params.tacticId);
    if (!tactic) {
      return res.status(404).json({ error: "Tactic not found" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const imageUrl = `/api/uploads/images/${req.file.filename}`;
    if (!tactic.images) {
      tactic.images = [];
    }
    tactic.images.push(imageUrl);
    await tactic.save();

    res.json({
      message: "Image uploaded successfully",
      imageUrl: imageUrl,
      images: tactic.images
    });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete image
router.delete("/image/:tacticId", async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const tactic = await Tactic.findById(req.params.tacticId);
    if (!tactic) {
      return res.status(404).json({ error: "Tactic not found" });
    }

    tactic.images = tactic.images.filter(img => img !== imageUrl);
    await tactic.save();

    const filename = imageUrl.split("/").pop();
    const filePath = path.join(imagesDir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ message: "Image deleted successfully", images: tactic.images });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Download tactic file
router.get("/download/:filename", (req, res) => {
  const filePath = path.join(uploadDir, req.params.filename);
  if (fs.existsSync(filePath)) {
    res.download(filePath, req.params.filename);
  } else {
    res.status(404).json({ error: "File not found" });
  }
});

module.exports = router;
