"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const dotenv = require("dotenv");

// 載入環境變數
dotenv.config();

const basename = path.basename(__filename);
const db = {};

// 使用環境變數初始化 Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT || 3306,
    logging: console.log, // 開啟 SQL 日誌
    define: {
      timestamps: true, // 啟用時間戳記
      createdAt: "created_at", // 全局設置 createdAt 對應到 created_at
      updatedAt: "updated_at", // 全局設置 updatedAt 對應到 updated_at
    },
  }
);

// 動態載入所有模型
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

// 定義表之間的關聯
// 產品資訊和圖片
db.products_info.hasMany(db.product_images, {
  foreignKey: "product_id",
  as: "product_id_hasmany_img",
});

// 產品資訊和圖片
db.product_images.belongsTo(db.products_info, {
  foreignKey: "product_id",
});

// 種類和產品資訊
db.products_info.belongsTo(db.categories, {
  foreignKey: "category_id",
  as: "category_id_belong_info",
});

// 產品資訊和顏色
db.products_info.hasMany(db.product_colors, {
  foreignKey: "product_id",
  as: "product_id_hasmany_color",
});

// 產品資訊和顏色
db.product_colors.belongsTo(db.products_info, {
  foreignKey: "product_id",
  as: "product_color_belong_product_id",
});

// 產品顏色和顏色
db.product_colors.belongsTo(db.colors, {
  foreignKey: "color_id", // 關聯外鍵是 color_id
  as: "product_color_belong_color", // 設置別名，方便在 API 中關聯顏色數據
});

// 產品顏色和顏色
db.colors.hasMany(db.product_colors, {
  foreignKey: "color_id",
  as: "color_hasmany_product_colors",
});

// 當 user表 內的 user_id被刪除 detail表 內對應的資訊也會被刪除
db.user_detail.belongsTo(db.users, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});

db.users.hasOne(db.user_detail, {
  foreignKey: "user_id",
});

// 購物車和顏色
db.cart.belongsTo(db.colors, {
  foreignKey: "color_id",
  as: "cart_belong_color",
});

// 購物車和顏色
db.colors.hasMany(db.cart, {
  foreignKey: "color_id",
  as: "color_hasmany_cart",
});

// 購物車和商品資訊
db.cart.belongsTo(db.products_info, {
  foreignKey: "product_id",
  as: "cart_belong_info",
});

db.orders.hasMany(db.order_items, {
  foreignKey: "order_id",
  as: "orders_hasmany_order_items",
});

db.order_items.belongsTo(db.orders, {
  foreignKey: "order_id",
});

db.order_items.belongsTo(db.products_info, {
  foreignKey: "product_id",
  as: "order_items_belong_product_info",
});

db.order_items.belongsTo(db.colors, {
  foreignKey: "color_id",
  as: "order_item_belong_colors",
});

// 遍歷模型以應用關聯
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
