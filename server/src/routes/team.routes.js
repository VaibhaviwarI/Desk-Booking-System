const express = require("express");
const router = express.Router();
const {
  createTeam,
  getTeams,
  assignUserToTeam,
} = require("../controllers/team.controller");
const {
  authMiddleware,
  authAdminMiddleware,
} = require("../middleware/auth.middleware");

router.use(authMiddleware);

router.get("/", getTeams);
router.post("/", authAdminMiddleware, createTeam);
router.post("/assign", authAdminMiddleware, assignUserToTeam);

module.exports = router;
