const express = require("express");
const permission_controller = require("../controllers/permission_controller");
const router = express.Router();

// 加載 role 選項
router.get("/get_role", permission_controller.get_role);

module.exports = router;
