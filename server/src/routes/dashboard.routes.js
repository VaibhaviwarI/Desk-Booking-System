const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/dashboard.controller");
const { authMiddleware } = require("../middleware/auth.middleware");

router.use(authMiddleware);

router.get("/stats", getDashboardStats);

module.exports = router;
