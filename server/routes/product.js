const express = require("express");
const product_controller = require("../controllers/product_controller");
const router = express.Router();

// 獲取商品資訊
router.get("/get_product_data", product_controller.get_product_data);

// 獲取商品種類選項
router.get("/get_product_category", product_controller.get_product_category);

// 獲取顏色選項
router.get("/get_colors", product_controller.get_colors);

// 新增商品
router.post("/create_product", product_controller.create_product);

module.exports = router;
