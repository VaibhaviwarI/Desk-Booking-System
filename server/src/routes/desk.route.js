const express = require("express");
const router = express.Router();
const {
  createDesk,
  getDesks,
  updateDesk,
  deleteDesk,
} = require("../controllers/desk.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

router.use(protect);

router.get("/", getDesks);
router.post("/", authorize("ADMIN"), createDesk);
router.put("/:id", authorize("ADMIN"), updateDesk);
router.delete("/:id", authorize("ADMIN"), deleteDesk);

module.exports = router;
