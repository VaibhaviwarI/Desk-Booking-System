const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  updateUserRole,
  getAllBookings,
  getAdminStats,
} = require("../controllers/admin.controller");
const {
  authMiddleware,
  authAdminMiddleware,
} = require("../middleware/auth.middleware");

// Enforce both general authentication and ADMIN role for all admin routes
router.use(authMiddleware);
router.use(authAdminMiddleware);

router.get("/users", getAllUsers);
router.patch("/users/:userId", updateUserRole);
router.get("/bookings", getAllBookings);
router.get("/stats", getAdminStats);

module.exports = router;
