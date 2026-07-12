const express = require("express");
const router = express.Router();

const {
  getBudgetDashboard,
} = require("../controllers/dashboardController");

router.get("/budget", getBudgetDashboard);

module.exports = router;