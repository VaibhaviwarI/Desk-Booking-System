const express = require("express");
const router = express.Router();
const {
  bookDesk,
  getMyBookings,
  cancelBooking,
  checkInBooking,
} = require("../controllers/booking.controller");
const { protect } = require("../middleware/auth.middleware");

router.use(protect);

router.post("/book", bookDesk);
router.get("/my-bookings", getMyBookings);
router.patch("/:bookingId/cancel", cancelBooking);
router.patch("/:bookingId/check-in", checkInBooking);

module.exports = router;
