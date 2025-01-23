const db = require("../models");

exports.isAuthenticated = (require_permission_id) => {
  return async (req, res, next) => {
    // 先檢查是否登入
    if (!req.session.admin) {
      return res.status(401).json({ message: "尚未登入" });
    }

    const { role_id, admin_id } = req.session.admin;

    // 檢查角色是否有對應的權限
    try {
      const result = await db.role_permission.findOne({
        where: { role_id, permission_id: require_permission_id },
      });

      if (!result) {
        console.log(`${admin_id} 沒有權限執行 ${role_id} 操作`);
        return res.status(403).json({ message: "沒有權限執行此操作!" });
      }

      console.log(`${admin_id} 通過 ${role_id} 權限檢查`);
      return next();
    } catch (error) {
      console.error("權限檢查失敗!", error);
      res.status(500).json({ message: "權限檢查失敗!", error });
    }
  };
};
