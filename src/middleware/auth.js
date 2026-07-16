const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Verifies the JWT sent in the Authorization header ("Bearer <token>").
 * If valid, attaches the corresponding user document to req.user and calls next().
 * If missing/invalid, responds with 401.
 */
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user (without password) to the request object
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, user no longer exists",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token invalid or expired",
    });
  }
};

/**
 * Restricts a route to admins only. Must be used AFTER `protect`.
 */
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied, admin privileges required",
    });
  }
  next();
};

module.exports = { protect, adminOnly };
