const express = require("express");
const User = require("../models/User");
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

module.exports = router;
