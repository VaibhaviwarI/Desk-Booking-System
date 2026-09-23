const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  updateUserRole,
  getAllBookings,
  getAdminStats,
} = require("../controllers/admin.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

// Enforce both authentication and ADMIN role for all admin routes
router.use(protect);
router.use(authorize("ADMIN"));

router.get("/users", getAllUsers);
router.patch("/users/:userId", updateUserRole);
router.get("/bookings", getAllBookings);
router.get("/stats", getAdminStats);

module.exports = router;
