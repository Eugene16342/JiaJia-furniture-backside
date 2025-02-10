const express = require("express");
const revenue_controller = require("../controllers/revenue_controller");
const router = express.Router();

router.get("/get_revenue_data", revenue_controller.get_revenue_data);

module.exports = router;
