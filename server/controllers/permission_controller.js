const bcrypt = require("bcrypt");
const db = require("../models");

// 加載 role 選項
exports.get_role = async (req, res) => {
  try {
    const roles = await db.role.findAll({
      attributes: ["role_id", "role_name"],
    });

    res.status(200).json(roles);
  } catch (error) {
    console.error("獲取 role 選項失敗!", error);
    res.status(500).json({ message: "無法獲取 role 選項" });
  }
};
