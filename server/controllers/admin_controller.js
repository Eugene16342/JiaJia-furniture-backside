const db = require("../models");

// 過濾權限中的 parent
function filter_parent(permissions) {
  // 找出所有的 parent_id
  const parent_ids = new Set(
    permissions
      .filter((perm) => perm.parent_id)
      .map((perm) => Number(perm.parent_id))
  );

  // 過濾掉 permission_id 與 parent_id 相符的權限
  return permissions.filter((perm) => !parent_ids.has(perm.permission_id));
}

//////////////////// 管理員增刪 ////////////////////////////////////

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

    if (!admin_id || !role_id) {
      return res.status(400).json({ message: "參數不完整!" });
    }

    const commander = req.session.admin.admin_id;
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

//////////////////// 權限改變 ////////////////////////////////////

// 獲取所有權限選項
exports.get_all_permission_option = async (req, res) => {
  try {
    const all_permissions = await db.permission.findAll({
      attributes: ["permission_id", "permission_name", "parent_id"],
    });

    const filtered_permissions = filter_parent(all_permissions);

    // 返回過濾後的結果
    res.status(200).json(filtered_permissions);
  } catch (error) {
    console.error("獲取角色選項失敗!", error);
    res.status(500).json({ message: "獲取角色選項失敗!" });
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

    // 查詢所有選中的權限資料
    const selected_permissions = await db.permission.findAll({
      where: {
        permission_id: permissions,
      },
      attributes: ["permission_id", "parent_id"],
      raw: true,
    });

    const final_permissions = new Set();

    selected_permissions.forEach((perm) => {
      final_permissions.add(perm.permission_id);
      // 如果該權限有 parent_id 也把她加入集合
      if (perm.parent_id) {
        final_permissions.add(Number(perm.parent_id));
      }
    });

    // 將 Set 轉換為陣列
    const unique_permissions = Array.from(final_permissions);

    // 建立角色
    const new_role = await db.role.create(
      {
        role_name: name,
      },
      { transaction }
    );

    // 建立角色權限
    const new_role_permissions = unique_permissions.map((permission_id) => ({
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
    if (transaction) {
      await transaction.rollback();
    }

    console.error("建立角色失敗!", error);
    res.status(500).json({ message: "建立角色失敗!" });
  }
};

// 獲取特定角色的當前權限
exports.get_role_permissions = async (req, res) => {
  try {
    const { role_id } = req.query;

    if (!role_id) {
      return res.status(400).json({ message: "缺少角色 ID" });
    }

    const isExist = await db.role.findOne({
      where: { role_id },
    });

    if (!isExist) {
      return res.status(404).json({ message: "此角色不存在" });
    }

    const permission_id = await db.role_permission.findAll({
      where: { role_id },
      attributes: ["permission_id"],
    });

    const permission_ids = permission_id.map((perm) => perm.permission_id);
    // 返回結果
    res.status(200).json({ permission_ids });
  } catch (error) {
    console.error("獲取特定角色權限失敗!", error);
    res.status(500).json({ message: "獲取特定角色權限失敗!" });
  }
};

// 保存對角色權限的更改
exports.save_role_permission_change = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { role_id, permission_ids } = req.body;

    if (!role_id) {
      return res.status(400).json({ message: "參數不完整!" });
    }

    const isExist = await db.role.findOne({ where: { role_id } });
    if (!isExist) {
      return res.status(400).json({ message: "此角色不存在!" });
    }

    const commander = req.session.admin.role_id;
    if (commander == role_id) {
      return res.status(403).json({ message: "不能更動自己的權限!" });
    }

    // 獲取所有權限信息，包含 parent_id
    const permissions = await db.permission.findAll({
      where: { permission_id: permission_ids },
      attributes: ["permission_id", "parent_id"],
    });

    // 建立一個集合來避免重複添加
    const all_permissions = new Set(permission_ids);

    // 檢查並加入父權限
    permissions.forEach((perm) => {
      if (perm.parent_id && !all_permissions.has(perm.parent_id)) {
        all_permissions.add(perm.parent_id); // 添加父權限
      }
    });

    // 刪除該角色所有權限
    await db.role_permission.destroy({
      where: { role_id: role_id },
      transaction,
    });

    const new_role_permissions = Array.from(all_permissions).map(
      (permission_id) => ({
        role_id,
        permission_id,
      })
    );

    await db.role_permission.bulkCreate(new_role_permissions, { transaction });
    await transaction.commit();
    res.status(200).json({ message: "角色權限更新成功!" });
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error("保存角色權限更動失敗!", error);
    res.status(500).json({ message: "保存角色更動失敗!" });
  }
};
