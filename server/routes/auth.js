const express = require("express");
const auth_controller = require("../controllers/auth_controller");
const router = express.Router();
const { isAuthenticated } = require("../middleware/authenticate");

// 註冊
router.post("/auth/register", auth_controller.register);

// 登入
router.post("/auth/login", auth_controller.login);

// 持久化前端數據
router.get("/auth/check_login", auth_controller.check_login);

// 登出
router.post("/auth/logout", auth_controller.logout);

module.exports = router;
