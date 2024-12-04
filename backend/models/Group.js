const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // References User model
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Single ObjectId reference
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Group", GroupSchema);
