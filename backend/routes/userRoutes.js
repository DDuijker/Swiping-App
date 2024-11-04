const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Register a new user
router.post("/register", async (req, res) => {
    const { username, email, password, avatar, favoriteGenres } = req.body;

    try {
        // Check if username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ msg: "Username or email already exists" });
        }

        // Create a new user
        const newUser = new User({ username, email, password, avatar, favoriteGenres });
        await newUser.save();

        res.status(201).json({ msg: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// Login a user
router.post("/login", async (req, res) => {
    console.log("route reached")
    const { username, password } = req.body;

    try {
        // Find user by username
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ msg: "Invalid username or password" });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid username or password" });

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Send back the user info and token
        res.json({ token, user: { username: user.username, email: user.email, avatar: user.avatar, favoriteGenres: user.favoriteGenres } });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

module.exports = router;
