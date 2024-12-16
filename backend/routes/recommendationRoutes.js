const express = require("express");
const router = express.Router();
const { getMoviesByGroup } = require("../controllers/recommendationController");
const authenticate = require("../middleware/authenticate");

// Route: GET /api/recommendations/:groupId/movies
router.get("/:groupId/", authenticate, getMoviesByGroup);

module.exports = router;
