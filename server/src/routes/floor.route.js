const express = require("express");
const router = express.Router();
const {
  createFloor,
  getFloors,
  updateFloor,
  deleteFloor,
} = require("../controllers/floor.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

router.use(protect);

router.get("/", getFloors);
router.post("/", authorize("ADMIN"), createFloor);
router.put("/:id", authorize("ADMIN"), updateFloor);
router.delete("/:id", authorize("ADMIN"), deleteFloor);

module.exports = router;
