const jwt = require("jsonwebtoken");

/**
 * Middleware to authenticate requests using JWT
 */
const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    res.status(401).json({ msg: "Unauthorized" });
  }
};

module.exports = authenticate;
