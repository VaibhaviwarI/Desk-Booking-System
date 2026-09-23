const express = require("express");
const router = express.Router();
const {
  getMyWaitlist,
  cancelWaitlist,
} = require("../controllers/waitlist.controller");
const { protect } = require("../middleware/auth.middleware");

router.use(protect);

router.get("/my-waitlist", getMyWaitlist);
router.patch("/:waitlistId/cancel", cancelWaitlist);

module.exports = router;
