const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  movieId: { type: Number, required: true },
  matchedAt: { type: Date, default: Date.now },
});

MatchSchema.index({ groupId: 1, movieId: 1 }, { unique: true });

module.exports = mongoose.model("Match", MatchSchema);
