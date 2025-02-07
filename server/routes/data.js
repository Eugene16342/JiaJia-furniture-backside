const express = require("express");
const data_controller = require("../controllers/data_controller");
const router = express.Router();

// 獲取銷售數據
router.get("/get_sales_data", data_controller.get_sales_data);

module.exports = router;
