const express = require("express");
const revenue_controller = require("../controllers/revenue_controller");
const router = express.Router();

router.get("/get_sales_data", revenue_controller.get_sales_data);

module.exports = router;
