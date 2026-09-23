const express = require("express");
const router = express.Router();
const {
  createFloor,
  getFloors,
  updateFloor,
  deleteFloor,
} = require("../controllers/floor.controller");
const {
  authMiddleware,
  authAdminMiddleware,
} = require("../middleware/auth.middleware");

router.use(authMiddleware);

router.get("/", getFloors);
router.post("/", authAdminMiddleware, createFloor);
router.put("/:id", authAdminMiddleware, updateFloor);
router.delete("/:id", authAdminMiddleware, deleteFloor);

module.exports = router;
