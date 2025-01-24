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

    await db.admin.destroy({ where: { admin_id } });

    return res.status(200).json({ message: "刪除管理員成功!" });
  } catch (error) {
    console.error("刪除管理員失敗!", error);
    res.status(500).json({ message: "刪除管理員失敗!" });
  }
};

// 獲取所有權限選項
exports.get_all_permission_option = async (req, res) => {
  try {
    const all_permissions = await db.permission.findAll({
      attributes: ["permission_id", "permission_name", "parent_id"],
      raw: true,
    });

    // 過濾出有 parent_id 的權限 並獲取其 parent_id
    const parent_ids = new Set(
      all_permissions
        .filter((perm) => perm.parent_id)
        .map((perm) => Number(perm.parent_id))
    );

    // 過濾 permission_id === parent_id 相符的權限
    const filtered_permissions = all_permissions.filter((perm) => {
      return !parent_ids.has(perm.permission_id);
    });

    // 返回過濾後的結果
    res.status(200).json(filtered_permissions);
  } catch (error) {
    console.error("獲取角色選項失敗!", error);
    res.status(500).json({ meeeage: "獲取角色選項失敗!" });
  }
};

// 創立新角色
exports.create_new_role = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { name, permissions } = req.body;

    // 檢查參數
    if (!name || permissions.length === 0) {
      return res.status(400).json({ message: "參數不完整" });
    }

    // 檢查名稱是否重複
    const isRepeat = await db.role.findOne({
      where: {
        role_name: name,
      },
    });

    if (isRepeat) {
      return res.status(403).json({ message: "角色名稱重複" });
    }

    // 建立角色
    const new_role = await db.role.create(
      {
        role_name: name,
      },
      { transaction }
    );

    // 建立角色權限
    const new_role_permissions = permissions.map((permission_id) => ({
      role_id: new_role.role_id,
      permission_id: permission_id,
    }));
    await db.role_permission.bulkCreate(new_role_permissions, { transaction });

    // 提交 transaction
    await transaction.commit();

    res.status(201).json({
      message: "角色建立成功!",
    });
  } catch (error) {
    console.error("建立角色失敗!", error);
    res.status(500).json({ message: "建立角色失敗!" });
  }
};
