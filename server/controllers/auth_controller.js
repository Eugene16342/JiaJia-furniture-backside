const bcrypt = require("bcrypt");
const db = require("../models");

// 註冊
exports.register = async (req, res) => {
  const { admin_id, name, role_id, password } = req.body;

  if (!admin_id || !name || !role_id || !password) {
    return res.status(400).json({ error: "請填寫所有欄位" });
  }

  try {
    const hashed_password = await bcrypt.hash(password, 10);

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

// 登入
exports.login = async (req, res) => {
  const { admin_id, password } = req.body;

  if (!admin_id || !password) {
    return res.status(400).json({ message: "ID或密碼錯誤!" });
  }

  try {
    const admin = await db.admin.findOne({
      where: { admin_id },
    });

    if (!admin) {
      return res.status(401).json({ message: "該用戶不存在或密碼錯誤!" });
    }

    const isPassword = await bcrypt.compare(password, admin.password);
    if (!isPassword) {
      return res.status(401).json({ message: "該用戶不存在或密碼錯誤!" });
    }

    const role_name = await translate_position(admin.role_id);

    req.session.admin = {
      admin_id,
      name: admin.name,
      role_id: admin.role_id,
      role_name,
    };

    res.status(200).json({ message: "登入成功!", admin: req.session.admin });
  } catch (error) {
    console.error("登入時發生錯誤!", error);
    res.status(500).json({ message: "登入時發生錯誤，請稍後再試" });
  }
};

// 翻譯 role_id
function translate_position(role_id) {
  switch (role_id) {
    case "1":
      return "管理員";

    case "2":
      return "一般職員";

    default:
      return "未知角色";
  }
}

//持久化前端資訊
exports.check_login = (req, res) => {
  // console.log("檢查 Session:", req.session);
  if (req.session && req.session.admin) {
    res.status(200).json({ admin: req.session.admin });
  } else {
    res.status(401).json({ message: "尚未登入!" });
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
