const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Register a new user
router.post("/register", async (req, res) => {
  const {
    username,
    email,
    password,
    avatar,
    favoriteMovieGenres,
    favoriteTVGenres,
  } = req.body;

  try {
    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ msg: "Username or email already exists" });
    }

    // Create a new user
    const newUser = new User({
      username,
      email,
      password,
      avatar,
      favoriteMovieGenres,
      favoriteTVGenres,
    });
    await newUser.save();

    res.status(201).json({ msg: "User registered successfully "});
  } catch (error) {
    res.status(500).json({ msg: error.message})
  }
});

// Login a user
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({ msg: "Invalid username or password" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Invalid username or password" });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "200h",
    });

    // Send back the user info and token
    res.json({
      token,
      user: {
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        favoriteMovieGenres: user.favoriteMovieGenres,
        favoriteTVGenres: user.favoriteTVGenres,
      },
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Change Password
router.put("/change-password", async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if the current password matches
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect current password" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ msg: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Change Email
router.put("/change-email", async (req, res) => {
  const { userId, newEmail } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if the new email is already in use
    const emailExists = await User.findOne({ email: newEmail });
    if (emailExists) {
      return res.status(400).json({ msg: "Email already in use" });
    }

    user.email = newEmail;
    await user.save();

    res.status(200).json({ msg: "Email updated successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Delete Account
router.delete("/delete-account", async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({ msg: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

const authenticateToken = require("../middleware/authMiddleware");

// Bescherm routes
router.put("/change-password", authenticateToken, async (req, res) => {
  // Logica voor wachtwoord wijzigen
});
router.put("/change-email", authenticateToken, async (req, res) => {
  // Logica voor e-mailadres wijzigen
});
router.delete("/delete-account", authenticateToken, async (req, res) => {
  // Logica voor account verwijderen
});


module.exports = router;
