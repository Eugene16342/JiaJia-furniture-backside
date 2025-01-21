const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "products_info",
    {
      product_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      materials: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "材質資訊，使用鍵值對形式存儲，例如: 面料:牛皮|框架:柳安木",
      },
      length: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: "長度（公分）",
      },
      width: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: "寬度（公分）",
      },
      height: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: "高度（公分）",
      },
      price: {
        type: DataTypes.DECIMAL(10, 0),
        allowNull: false,
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "categories",
          key: "category_id",
        },
      },
      status: {
        type: DataTypes.ENUM("normal", "onsale", "cancel"),
        allowNull: false,
        defaultValue: "normal",
      },
    },
    {
      sequelize,
      tableName: "products_info",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "product_id" }],
        },
        {
          name: "fk_products_category",
          using: "BTREE",
          fields: [{ name: "category_id" }],
        },
      ],
    }
  );
};
