const express = require("express");
const router = express.Router();
const {
  createDesk,
  getDesks,
  updateDesk,
  deleteDesk,
} = require("../controllers/desk.controller");
const {
  authMiddleware,
  authAdminMiddleware,
} = require("../middleware/auth.middleware");

router.use(authMiddleware);

router.get("/", getDesks);
router.post("/", authAdminMiddleware, createDesk);
router.put("/:id", authAdminMiddleware, updateDesk);
router.delete("/:id", authAdminMiddleware, deleteDesk);

module.exports = router;
