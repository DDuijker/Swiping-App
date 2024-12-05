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
} = require("../controllers/userController");

//Routes
router.get("/", getAllUsers); // Get all users
router.post("/register", registerUser); // Register a user
router.post("/login", loginUser); // Login a user
router.get("/search", searchUsers); // Search for users
router.get("/me", getAuthenticatedUser); // Get authenticated user
router.get("/:id", getUserById); // Get a user by ID
router.put("/:id", updateUser); // Update a user
router.delete("/:id", deleteUser); // Remove a user

module.exports = router;
