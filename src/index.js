const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const passwordRoutes = require("./routes/passwords");
const profileRoutes = require("./routes/profile");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/passwords", passwordRoutes);
app.use("/profile", profileRoutes);

app.get("/", (req, res) => res.json({ status: "PassVault API running" }));

// Connect to MongoDB then start server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error("DB connection failed:", err));

module.exports = app;
