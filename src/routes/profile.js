const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Password = require("../models/Password");
const verifyToken = require("../middleware/verifyToken");

router.use(verifyToken);

// GET full profile with password counts
router.get("/", async (req, res) => {
  try {
    const [user, passwords] = await Promise.all([
      User.findById(req.userId),
      Password.find({ owner: req.userId }),
    ]);

    if (!user) return res.status(404).json({ error: "User not found" });

    // Count by category
    const counts = {
      all: passwords.length,
      important: passwords.filter((p) => p.category === "important").length,
      socials: passwords.filter((p) => p.category === "socials").length,
      least_important: passwords.filter((p) => p.category === "least_important").length,
      work: passwords.filter((p) => p.category === "work").length,
      other: passwords.filter((p) => p.category === "other").length,
    };

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        photoUrl: user.photoUrl,
        savedEmails: user.savedEmails || [],
        savedPhones: user.savedPhones || [],
      },
      counts,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// PUT update saved emails and phones
router.put("/saved-fields", async (req, res) => {
  try {
    const { savedEmails, savedPhones } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { savedEmails, savedPhones },
      { new: true }
    );
    res.json({
      savedEmails: user.savedEmails,
      savedPhones: user.savedPhones,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update saved fields" });
  }
});

module.exports = router;
