const express = require("express");
const auth_controller = require("../controllers/auth_controller");
const router = express.Router();
const { isAuthenticated } = require("../middleware/authenticate");
// 登入 持久畫 登出 不檢查權限

const permission_id = 1;

// 註冊
router.post(
  "/register",
  isAuthenticated(permission_id),
  auth_controller.register
);

// 登入
router.post("/login", auth_controller.login);

// 持久化前端數據
router.get("/check_login", auth_controller.check_login);

// 登出
router.post("/logout", auth_controller.logout);

module.exports = router;
