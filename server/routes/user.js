const express = require("express");
const user_controller = require("../controllers/user_controller");
const router = express.Router();

// 獲取 / 查詢 會員資料
router.get("/get_user_data", user_controller.get_user_data);

// 獲取 / 查詢 訂單資料
router.get("/get_order_data", user_controller.get_order_data);

module.exports = router;
