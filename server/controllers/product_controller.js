const db = require("../models");
const { Op } = require("sequelize");

// 獲取 / 查詢 商品資訊
exports.get_product_data = async (req, res) => {
  try {
    const { keyword, page = 1, limit = 10 } = req.query;

    // 分頁
    const offset = (page - 1) * limit;

    const condition = {};
    if (keyword) {
      condition.name = {
        [Op.like]: `%${keyword}%`,
      };
    }

    const products = await db.products_info.findAndCountAll({
      where: condition,
      attributes: [
        "product_id",
        "name",
        "description",
        "materials",
        "length",
        "width",
        "height",
        "price",
        "category_id",
        "status",
      ],
      include: [
        {
          model: db.categories,
          as: "category_id_belong_info",
          attributes: ["name_zh"],
        },
        {
          model: db.product_colors,
          as: "product_id_hasmany_color",
          attributes: ["color_id"],
          include: [
            {
              model: db.colors,
              as: "product_color_belong_color",
              attributes: ["color_name"],
            },
          ],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true,
    });

    const formatted_products = products.rows.map((product) => {
      return {
        product_id: product.product_id,
        name: product.name,
        description: product.description,
        materials: product.materials,
        size: `${product.length} x ${product.width} x ${product.height}`,
        height: product.height,
        price: product.price,
        category_name: product.category_id_belong_info?.name_zh || null,
        status: product.status,
        colors: product.product_id_hasmany_color.map(
          (color) => color.product_color_belong_color.color_name
        ),
      };
    });

    res.status(200).json({
      count: products.count,
      rows: formatted_products,
    });
  } catch (error) {
    console.error("獲取商品資訊失敗!", error);
    res.status(500).json({ message: "獲取商品資訊失敗!" });
  }
};
