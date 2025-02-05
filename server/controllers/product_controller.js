const db = require("../models");
const { Op } = require("sequelize");
const { upload_image } = require("../utils/upload");

///////////////////////////////   商品一覽   ///////////////////////////////////////////////////////////

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

///////////////////////////////   新增商品   ///////////////////////////////////////////////////////////
// 獲取商品種類選項
exports.get_product_category = async (req, res) => {
  try {
    const cate_options = await db.categories.findAll({
      attributes: ["category_id", "name_zh"],
    });
    res.status(200).json(cate_options);
  } catch (error) {
    console.error("獲取商品種類失敗!", error);
    res.status(500).json({ message: "獲取商品種類失敗!" });
  }
};

// 獲取顏色選項
exports.get_colors = async (req, res) => {
  try {
    const color_options = await db.colors.findAll({});

    res.status(200).json(color_options);
  } catch (error) {
    console.error("獲取顏色選項失敗!", error);
    res.status(500).json({ message: "獲取顏色選項失敗!" });
  }
};

// 新增商品
exports.create_product = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const {
      name,
      category,
      material,
      length,
      width,
      height,
      colors,
      description,
      price,
      quantity,
      img_list,
    } = req.body;

    if (
      !name ||
      !category ||
      !material ||
      !length ||
      !width ||
      !height ||
      !description ||
      !price ||
      !quantity ||
      !img_list ||
      img_list.length === 0
    ) {
      return res.status(400).json({ message: "缺少必要商品資訊!" });
    }

    // 在 product 新增商品
    const new_product = await db.products_info.create(
      {
        name,
        description,
        materials: material,
        length,
        width,
        height,
        price,
        category_id: category,
        status: "normal",
      },
      { transaction }
    );

    const product_id = new_product.product_id;

    // 在 sotcks 新增商品數量
    await db.stocks.create(
      {
        product_id,
        stock: quantity,
        sales: 0,
        safety_stock: 20,
      },
      { transaction }
    );

    // 如果有的話 在 product_colors 新增商品顏色
    if (Array.isArray(colors) && colors.length > 0) {
      const product_color = colors.map((color_id) => ({
        product_id,
        color_id,
      }));

      await db.product_colors.bulkCreate(product_color, { transaction });
    }

    const category_data = await db.categories.findOne({
      where: { category_id: category },
      attributes: ["name"],
    });

    const category_name = category_data.name;

    // 上傳圖片並新增圖片路徑
    const image_paths = [];
    for (let i = 0; i < img_list.length; i++) {
      const base64Image = img_list[i];
      const imageUrl = await upload_image(
        base64Image,
        category_name,
        product_id
      );
      image_paths.push(imageUrl);
    }

    // 在 product_images 插入圖片路徑
    const image_records = image_paths.map((url) => ({
      product_id,
      image_url: url,
    }));

    await db.product_images.bulkCreate(image_records, { transaction });

    await transaction.commit();
    res.status(200).json({ message: "新增商品成功!" });
  } catch (error) {
    await transaction.rollback();
    console.error("新增商品失敗!", error);
    res.status(500).json({ message: "新增商品失敗!" });
  }
};
///////////////////////////////   編輯商品   ///////////////////////////////////////////////////////////
