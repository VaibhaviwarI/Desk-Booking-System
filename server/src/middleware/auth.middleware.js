const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { JWT_SECRET } = require("../config/env");

/* =========================================================
   1. GENERAL USER AUTHENTICATION MIDDLEWARE
   Verifies JWT token and attaches user to req.user
========================================================= */
const authMiddleware = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

/* =========================================================
   2. ADMIN-ONLY AUTHORIZATION MIDDLEWARE
   Verifies user is logged in AND has role === 'ADMIN'
========================================================= */
const authAdminMiddleware = async (req, res, next) => {
  try {
    // If authMiddleware has not run yet, authenticate first
    if (!req.user) {
      let token;
      const authHeader = req.headers.authorization;

      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
      }

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: No token provided",
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      req.user = user;
    }

    // Check if role is ADMIN
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Admin access required. User role is '${req.user.role}'.`,
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = {
  authMiddleware,
  authAdminMiddleware,
  // Aliases for compatibility
  protect: authMiddleware,
  authAdmin: authAdminMiddleware,
  authorize: () => authAdminMiddleware,
};
