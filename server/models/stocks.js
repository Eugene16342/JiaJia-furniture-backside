const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "stocks",
    {
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "products_info",
          key: "product_id",
        },
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sales: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      safety_stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "stocks",
      timestamps: true, // 啟用 Sequelize 的 `timestamps`
      createdAt: "created_at", // 映射到資料庫的 `created_at`
      updatedAt: "updated_at", // 映射到資料庫的 `updated_at`
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "product_id" }],
        },
      ],
    }
  );
};
