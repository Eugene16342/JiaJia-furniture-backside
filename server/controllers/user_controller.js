const db = require("../models");
const { Op } = require("sequelize");

// 獲取 / 查詢 使用者資訊
exports.get_user_data = async (req, res) => {
  try {
    const { select, keyword, page = 1, limit = 10 } = req.query;

    // 允許的字搜索種類
    const valid_select = ["user_name", "email"];

    // 如果 select 為空或不在允許範圍內，返回錯誤
    if (select && !valid_select.includes(select)) {
      return res.status(400).json({ message: "無效的查詢欄位!" });
    }

    // 分頁
    const offset = (page - 1) * limit;

    // 如果沒有關鍵字 搜索條件為空
    const search_condition = keyword
      ? { [select]: { [Op.like]: `%${keyword}%` } }
      : {};

    const users = await db.users.findAndCountAll({
      where: search_condition,
      attributes: ["user_name", "email", "created_at", "update_at", "status"],
      include: [
        {
          model: db.user_detail,
          attributes: ["first_name", "last_name", "phone", "address"], // 選取需要的字段
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const formatted_data = users.rows.map((user) => {
      const user_data = user.toJSON();
      return {
        ...user_data,
        // 格式化為 YYYY/MM/DD
        created_at: new Date(user_data.created_at).toLocaleDateString("zh-TW"),
        update_at: new Date(user_data.update_at).toLocaleDateString("zh-TW"),
      };
    });

    res.status(200).json({
      data: formatted_data,
      total: users.count,
      current_page: parseInt(page),
      total_pages: Math.ceil(users.count / limit),
    });
  } catch (error) {
    console.error("獲取會員資訊失敗!", error);
    res.status(500).json({ error: "獲取會員資訊失敗!" });
  }
};
