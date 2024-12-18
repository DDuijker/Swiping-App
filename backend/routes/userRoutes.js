const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getAllUsers,
  searchUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAuthenticatedUser,
  verifyPassword,
} = require("../controllers/userController");
const authenticate = require("../middleware/authenticate");

//Public Routes
router.post("/register", registerUser); // Register a user
router.post("/login", loginUser); // Login a user
router.get("/search", searchUsers); // Search for users

// Private Routes using authentication
router.get("/", authenticate, getAllUsers); // Get all users
router.get("/me", authenticate, getAuthenticatedUser); // Get authenticated user
router.get("/:id", authenticate, getUserById); // Get a user by ID
router.put("/:id", authenticate, updateUser); // Update a user
router.delete("/:id", authenticate, deleteUser); // Remove a user
router.post("/verify-password", authenticate, verifyPassword); //Verify password

module.exports = router;
