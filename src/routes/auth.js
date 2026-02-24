const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Called from app after Google Sign-In succeeds
// Google gives us user info — we register/login them in our DB
router.post("/google", async (req, res) => {
  try {
    const { googleId, email, name, photoUrl } = req.body;

    if (!googleId || !email) {
      return res.status(400).json({ error: "googleId and email are required" });
    }

    // Find existing user or create new one
    let user = await User.findOne({ googleId });

    if (!user) {
      user = await User.create({ googleId, email, name, photoUrl });
    } else {
      // Update name/photo in case they changed
      user.name = name;
      user.photoUrl = photoUrl;
      await user.save();
    }

    // Create JWT token — this is what the app stores and sends with every request
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.json({
      token,
      user: {
        _id: user._id,
        googleId: user.googleId,
        email: user.email,
        name: user.name,
        photoUrl: user.photoUrl,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during auth" });
  }
});

module.exports = router;
