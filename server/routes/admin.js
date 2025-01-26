const express = require("express");
const admin_controller = require("../controllers/admin_controller");
const router = express.Router();

//////////////////// 管理員增刪 ////////////////////////////////////

// 加載所有管理員
router.get("/get_all_admin", admin_controller.get_all_admin);

// 保存更改
router.post("/save_admin_change", admin_controller.save_admin_change);

// 刪除該 admin
router.delete("/delete_admin", admin_controller.delete_admin);

//////////////////// 權限改變 ////////////////////////////////////

// 獲取所有的權限選項
router.get(
  "/get_all_permission_option",
  admin_controller.get_all_permission_option
);

// 創建新的角色
router.post("/create_new_role", admin_controller.create_new_role);

//獲取特定角色的當前權限
router.get("/get_role_permissions", admin_controller.get_role_permissions);

// 保存對權限的更動
router.post(
  "/save_role_permission_change",
  admin_controller.save_role_permission_change
);

module.exports = router;
