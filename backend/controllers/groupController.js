const Group = require("../models/Group");

/**
 * @description Create a new group
 * @route POST /api/groups
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createGroup = async (req, res) => {
  console.log("POST request received");
  try {
    const { name, description, members, creator } = req.body;

    // Create a new group
    console.log("Received data:", req.body); 
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
