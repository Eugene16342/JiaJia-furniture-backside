const express = require("express");
const user_controller = require("../controllers/user_controller");
const router = express.Router();

// 獲取會員資料
router.get("/get_user_data", user_controller.get_user_data);

module.exports = router;
