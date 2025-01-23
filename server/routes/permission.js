const express = require("express");
const permission_controller = require("../controllers/permission_controller");
const router = express.Router();
const { isAuthenticated } = require("../middleware/authenticate");

// 加載 role 選項
router.get("/permission/get_role", permission_controller.get_role);

module.exports = router;
