const mongoose = require("mongoose");

const SwipeSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  movieId: { type: Number, required: true },
  direction: { type: String, enum: ["like", "dislike"], required: true },
  swipedAt: { type: Date, default: Date.now },
});

SwipeSchema.index({ groupId: 1, movieId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Swipe", SwipeSchema);
