const Group = require("../models/Group");

/**
 * @description Create a new group
 * @route POST /api/groups
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createGroup = async (req, res) => {
  try {
    const { name, description, members, creator } = req.body;

    // Create a new group
    const group = new Group({ name, description, members, creator });
    await group.save();

    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Get all groups
 * @route GET /api/groups
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getGroups = async (req, res) => {
  try {
    // Fetch all groups and populate members and creator with relevant fields
    const groups = await Group.find()
      .populate("members", "username email")
      .populate("creator", "username email");

    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Get a group by ID
 * @route GET /api/groups/:id
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getGroupById = async (req, res) => {
  try {
    // Find group by ID and populate members and creator
    const group = await Group.findById(req.params.id)
      .populate("members", "username email")
      .populate("creator", "username email");

    if (!group) return res.status(404).json({ message: "Group not found" });

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Get groups by user ID
 * @route GET /api/groups/user/:userId
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getGroupsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if userId is provided
    if (!userId) {
      return res
        .status(400)
        .json({ message: "User ID is required in the request parameters." });
    }

    // Check if userId is a valid ObjectId (assuming MongoDB)
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid User ID format." });
    }

    // Find groups where the user is either the creator or a member
    const groups = await Group.find({
      $or: [{ creator: userId }, { members: userId }],
    })
      .populate("members", "username email")
      .populate("creator", "username email");

    // If no groups are found
    if (!groups || groups.length === 0) {
      return res
        .status(404)
        .json({ message: "No groups found for the provided User ID." });
    }

    res.status(200).json(groups);
  } catch (error) {
    // Handle specific MongoDB errors
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ message: "Invalid data format in the request." });
    }

    // Log detailed error for debugging
    console.error("Error fetching groups by user ID:", error);

    // Generic server error response
    res.status(500).json({
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

/**
 * @description Update a group
 * @route PUT /api/groups/:id
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateGroup = async (req, res) => {
  try {
    // Update group details
    const group = await Group.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!group) return res.status(404).json({ message: "Group not found" });

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @description Delete a group
 * @route DELETE /api/groups/:id
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteGroup = async (req, res) => {
  try {
    // Delete the group
    const group = await Group.findByIdAndDelete(req.params.id);

    if (!group) return res.status(404).json({ message: "Group not found" });

    res.status(200).json({ message: "Group deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
