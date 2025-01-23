const express = require("express");
const admin_controller = require("../controllers/admin_controller");
const router = express.Router();
const { isAuthenticated } = require("../middleware/authenticate");

const permission_id = 1;

// 這裡所有路由都要檢查權限
router.use(isAuthenticated(permission_id));

// 加載所有管理員
router.get("/admin/get_all_admin", admin_controller.get_all_admin);

// 保存更改
router.post("/admin/save_admin_change", admin_controller.save_admin_change);

// 刪除該 admin
router.delete("/admin/delete_admin", admin_controller.delete_admin);

module.exports = router;
