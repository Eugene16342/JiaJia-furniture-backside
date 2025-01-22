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

// 註冊
exports.register = async (req, res) => {
  const { admin_id, name, role_id } = req.body;

  if (!admin_id || !name || !role_id) {
    return res.status(400).json({ error: "請填寫所有欄位" });
  }

  try {
    const hashed_password = await bcrypt.hash(admin_id, 10);

    await db.admin.create({
      admin_id,
      name,
      role_id,
      password: hashed_password,
    });

    res.status(200).json({ message: "註冊成功!" });
  } catch {
    console.error("註冊失敗!", error);
    res.status(500).json({ error: "伺服器錯誤，請稍後再試" });
  }
};

// 根據 role_id 取的權限內的功能
const aside_menu = async (role_id) => {
  try {
    const role = await db.role.findOne({
      where: { role_id },
      include: [
        {
          model: db.permission,
          as: "permissions",
          attributes: [
            "permission_id",
            "permission_name",
            "path",
            "icon",
            "parent_id",
          ],
        },
      ],
    });

    if (!role) {
      throw new Error("此 role 不存在");
    }

    const permissions = role.permissions || [];

    const menu_tree = (parent_id = null) => {
      return permissions
        .filter((perm) => perm.parent_id == parent_id)
        .map((perm) => ({
          title: perm.permission_name,
          path: perm.path,
          icon: perm.icon,
          children: menu_tree(perm.permission_id),
        }));
    };

    return menu_tree();
  } catch (error) {
    console.error("生成側邊選單時出現錯誤!", error);
  }
};

// 登入
exports.login = async (req, res) => {
  const { admin_id, password } = req.body;

  if (!admin_id || !password) {
    return res.status(400).json({ message: "ID或密碼錯誤!" });
  }

  try {
    const admin = await db.admin.findOne({
      where: { admin_id },
      include: [
        {
          model: db.role,
          as: "role",
          attributes: ["role_name", "role_id"],
        },
      ],
    });

    if (!admin) {
      return res.status(401).json({ message: "該用戶不存在或密碼錯誤!" });
    }

    const isPassword = await bcrypt.compare(password, admin.password);
    if (!isPassword) {
      return res.status(401).json({ message: "該用戶不存在或密碼錯誤!" });
    }

    const { role_id, role_name } = admin.role;

    // 調用 aside_menu 生成側邊選單
    const menu = await aside_menu(role_id);

    req.session.admin = {
      admin_id,
      name: admin.name,
      role_id: admin.role_id,
      role_name,
    };

    res
      .status(200)
      .json({ message: "登入成功!", admin: req.session.admin, menu });
  } catch (error) {
    console.error("登入時發生錯誤!", error);
    res.status(500).json({ message: "登入時發生錯誤，請稍後再試" });
  }
};

//持久化前端資訊
exports.check_login = async (req, res) => {
  try {
    if (req.session && req.session.admin) {
      const { role_id } = req.session.admin;

      const menu = await aside_menu(role_id);

      res.status(200).json({
        admin: req.session.admin,
        menu,
      });
    } else {
      res.status(401).json({ message: "尚未登入!" });
    }
  } catch (error) {
    console.error("檢查登入狀態時出現錯誤:", error);
    res.status(500).json({ message: "伺服器錯誤，請稍後再試!" });
  }
};

// 登出
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("session 銷毀失敗!", err);
      return res.status(500).json({ message: "登出失敗!" });
    }
    res.clearCookie("connect.sid");
    return res.status(200).json({ message: "登出成功!" });
  });
};
