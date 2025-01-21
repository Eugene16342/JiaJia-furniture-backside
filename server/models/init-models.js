var DataTypes = require("sequelize").DataTypes;
var _colors = require("./colors");
var _product_colors = require("./product_colors");
var _products_info = require("./products_info"); // 新增引入

function initModels(sequelize) {
  var colors = _colors(sequelize, DataTypes);
  var product_colors = _product_colors(sequelize, DataTypes);
  var products_info = _products_info(sequelize, DataTypes); // 初始化模型

  product_colors.belongsTo(colors, { as: "color", foreignKey: "color_id" });
  colors.hasMany(product_colors, {
    as: "product_colors",
    foreignKey: "color_id",
  });

  product_colors.belongsTo(products_info, {
    as: "product",
    foreignKey: "product_id",
  });
  products_info.hasMany(product_colors, {
    as: "product_colors",
    foreignKey: "product_id",
  });

  return {
    colors,
    product_colors,
    products_info, // 確保返回的模型中包含 `products_info`
  };
}

module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
