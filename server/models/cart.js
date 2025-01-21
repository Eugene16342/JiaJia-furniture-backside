const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "cart",
    {
      cart_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true, // 自增
      },
      user_id: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "products_info",
          key: "product_id",
        },
      },
      color_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // 允許為空，因為部分商品沒有顏色選項
        references: {
          model: "colors", // 關聯到 colors 表
          key: "color_id",
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "cart",
      timestamps: false, // 禁用時間戳記
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "cart_id" }],
        },
        {
          name: "fk_cart_product",
          using: "BTREE",
          fields: [{ name: "product_id" }],
        },
        {
          name: "fk_cart_user",
          using: "BTREE",
          fields: [{ name: "user_id" }],
        },
        {
          name: "fk_cart_color", // 新增 color_id 的索引
          using: "BTREE",
          fields: [{ name: "color_id" }],
        },
      ],
    }
  );
};
