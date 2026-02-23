const mongoose = require("mongoose");

const passwordSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    username: { type: String, default: "" }, // stored encrypted
    password: { type: String, required: true }, // stored encrypted
    website: { type: String, default: "" },
    notes: { type: String, default: "" }, // stored encrypted
    category: {
      type: String,
      enum: ["important", "least_important", "work", "other"],
      default: "other",
    },
  },
  { timestamps: true },
); // auto adds createdAt, updatedAt

module.exports = mongoose.model("Password", passwordSchema);
