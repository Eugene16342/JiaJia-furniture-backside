const db = require("../models");

// 獲取所有管理員
exports.get_all_admin = async (req, res) => {
  try {
    const admins = await db.admin.findAll({
      attributes: ["admin_id", "name", "role_id"],
    });

    res.status(200).json(admins);
  } catch (error) {
    console.error("獲取所有管理員失敗!", error);
    res.status(500).json({ message: "無法獲取所有管理員" });
  }
};

// 保存 role 的更改
exports.save_admin_change = async (req, res) => {
  try {
    const { admin_id, role_id } = req.body;
    const commander = req.session.admin.admin_id;

    if (!admin_id || !role_id) {
      return res.status(400).json({ message: "參數不完整!" });
    }

    if (commander == admin_id) {
      return res.status(403).json({ message: "不能更改自己的角色!" });
    }

    const isExist = await db.admin.findOne({
      where: { admin_id },
    });

    if (!isExist) {
      return res.status(400).json({ message: "該管理員不存在!" });
    }

    await db.admin.update({ role_id }, { where: { admin_id } });

    return res.status(200).json({ message: "角色更改成功!" });
  } catch (error) {
    console.error("role 更改失敗!", error);
    res.status(500).json({ message: "role 更改失敗!" });
  }
};

// 刪除 role
exports.delete_admin = async (req, res) => {
  try {
    console.log("請求body:", req.body);
    const { admin_id } = req.body;
    const commander = req.session.admin.admin_id;

    if (commander == admin_id) {
      return res.status(403).json({ message: "不能刪除自己!" });
    }

    const isExist = await db.admin.findOne({
      where: { admin_id },
    });

    if (!isExist) {
      return res.status(400).json({ message: "該管理員不存在!" });
    }
    await db.admin.destroy({ where: { admin_id } });

    return res.status(200).json({ message: "刪除管理員成功!" });
  } catch (error) {
    console.error("刪除管理員失敗!", error);
    res.status(500).json({ message: "刪除管理員失敗!" });
  }
};
