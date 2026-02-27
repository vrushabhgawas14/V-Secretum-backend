const express = require("express");
const router = express.Router();
const Password = require("../models/Password");
const verifyToken = require("../middleware/verifyToken");

// All routes below require a valid JWT
router.use(verifyToken);

// GET all passwords for logged-in user
router.get("/", async (req, res) => {
  try {
    const passwords = await Password.find({ owner: req.userId }).sort({
      updatedAt: -1,
    });
    res.json(passwords);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch passwords" });
  }
});

// GET password with ID for logged-in user
router.get("/:id", async (req, res) => {
  try {
    const password = await Password.findOne({
      _id: req.params.id,
      owner: req.userId,
    }).sort({
      updatedAt: -1,
    });
    res.json(password);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch password with ID" });
  }
});

// POST create new password entry
router.post("/", async (req, res) => {
  try {
    const {
      title,
      username,
      email,
      phoneNumber,
      password,
      website,
      notes,
      category,
    } = req.body;

    if (!title || !password) {
      return res.status(400).json({ error: "Title and password are required" });
    }

    const entry = await Password.create({
      owner: req.userId,
      title,
      username,
      email,
      phoneNumber,
      password,
      website,
      notes,
      category,
    });

    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ error: "Failed to create entry" });
  }
});

// PUT update a password entry
router.put("/:id", async (req, res) => {
  try {
    const entry = await Password.findOne({
      _id: req.params.id,
      owner: req.userId,
    });

    if (!entry) {
      return res.status(404).json({ error: "Entry not found" });
    }

    const {
      title,
      username,
      email,
      phoneNumber,
      password,
      website,
      notes,
      category,
    } = req.body;

    if (!title || !password) {
      return res
        .status(400)
        .json({ error: "Title and password cannot be updated to blank." });
    }

    Object.assign(entry, {
      title,
      username,
      email,
      phoneNumber,
      password,
      website,
      notes,
      category,
    });
    await entry.save();

    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: "Failed to update entry" });
  }
});

// DELETE a password entry
router.delete("/:id", async (req, res) => {
  try {
    const entry = await Password.findOneAndDelete({
      _id: req.params.id,
      owner: req.userId,
    });

    if (!entry) {
      return res.status(404).json({ error: "Entry not found" });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete entry" });
  }
});

module.exports = router;
