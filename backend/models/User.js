const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  avatar: {
    type: String,
  },
  favoriteMovieGenres: {
    type: [
      {
        id: Number,
        name: String,
      },
    ],
    default: [],
  },
  favoriteTVGenres: {
    type: [
      {
        id: Number,
        name: String,
      },
    ],
    default: [],
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("User", UserSchema);
