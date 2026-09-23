const express = require("express");
const router = express.Router();
const {
  getMyWaitlist,
  cancelWaitlist,
} = require("../controllers/waitlist.controller");
const { authMiddleware } = require("../middleware/auth.middleware");

router.use(authMiddleware);

router.get("/my-waitlist", getMyWaitlist);
router.patch("/:waitlistId/cancel", cancelWaitlist);

module.exports = router;
