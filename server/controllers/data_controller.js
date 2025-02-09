const db = require("../models");
const { Op } = require("sequelize");

// 獲取銷售數據
exports.get_sales_data = async (req, res) => {
  try {
    const {
      keyword,
      page = 1,
      limit = 10,
      sort = "product_id",
      order = "ASC",
    } = req.query;

    // 分頁
    const offset = (page - 1) * limit;

    const condition = {};
    if (keyword) {
      condition.name = {
        [Op.like]: `%${keyword}%`,
      };
    }

    // 確保排序欄位安全
    const valid_sort_fields = {
      "product_stock.sales": db.Sequelize.literal("`product_stock`.`sales`"),
      "product_stock.stock": db.Sequelize.literal("`product_stock`.`stock`"),
    };

    const sort_field = valid_sort_fields[sort] || "product_id";
    const sort_order = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

    const { count, rows } = await db.products_info.findAndCountAll({
      where: condition,
      attributes: ["product_id", "name"],
      include: [
        {
          model: db.stocks,
          as: "product_stock",
          attributes: ["stock", "sales", "safety_stock"],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sort_field, sort_order]],
      distinct: true,
    });

    res.status(200).json({
      count,
      rows,
    });
  } catch (error) {
    console.error("獲取商品資訊失敗!", error);
    res.status(500).json({ message: "獲取商品資訊失敗!" });
  }
};
