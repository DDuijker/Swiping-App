const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * @description Register a new user
 * @route POST /api/user/register
 * @access Public
 */
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, favoriteMovieGenres, favoriteTVGenres } =
      req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    // Create a new user
    const newUser = await User.create({
      username,
      email,
      password,
      favoriteMovieGenres,
      favoriteTVGenres,
    });

    // Generate JWT token after successful registration
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ user: newUser, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Login an existing user
 * @route POST /api/user/login
 * @access Public
 */
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Get all users
 * @route GET /api/user
 * @access Private
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Get users by username or fetch all
 * @route GET /api/user/search
 * @access Public
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.searchUsers = async (req, res) => {
  try {
    const { username } = req.query;

    // If a username query is provided, perform a case-insensitive search
    const users = username
      ? await User.find({
          username: { $regex: username, $options: "i" },
        }).select("username _id")
      : await User.find().select("username _id");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Get a user by ID
 * @route GET /api/user/:id
 * @access Private
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Update a user's information
 * @route PUT /api/user/:id
 * @access Private
 */
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Delete a user
 * @route DELETE /api/user/:id
 * @access Private
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Get authenticated user's info
 * @route GET /api/user/me
 * @access Private
 */
exports.getAuthenticatedUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Error in getAuthenticatedUser:", error.message);
    res
      .status(500)
      .json({ message: "Server error. Unable to fetch user info." });
  }
};
