const express = require("express");
const router = express.Router();
const {
  createGroup,
  getGroups,
  getGroupsByUserId,
  getGroupById,
  updateGroup,
  deleteGroup,
} = require("../controllers/groupController.js");

// CRUD routes
router.post("/", createGroup); // Create a group
router.get("/", getGroups); // Get all groups
router.get("/user/:userId", getGroupsByUserId); // Get groups by user ID
router.get("/:id", getGroupById); // Get one group by ID
router.put("/:id", updateGroup); // Edit a group
router.delete("/:id", deleteGroup); // Remove a group

module.exports = router;
