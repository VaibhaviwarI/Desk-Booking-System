const express = require("express");
const router = express.Router();
const {
  createTeam,
  getTeams,
  assignUserToTeam,
} = require("../controllers/team.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

router.use(protect);

router.get("/", getTeams);
router.post("/", authorize("ADMIN"), createTeam);
router.post("/assign", authorize("ADMIN"), assignUserToTeam);

module.exports = router;
