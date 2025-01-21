const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "order_items",
    {
      order_item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      order_id: {
        type: DataTypes.CHAR(6),
        allowNull: false,
        references: {
          model: "orders",
          key: "order_id",
        },
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "products_info",
          key: "product_id",
        },
        color_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: "colors",
            key: "color_id",
          },
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 0),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "order_items",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "order_item_id" }],
        },
        {
          name: "fk_order_items_order",
          using: "BTREE",
          fields: [{ name: "order_id" }],
        },
        {
          name: "fk_order_items_product",
          using: "BTREE",
          fields: [{ name: "product_id" }],
        },
      ],
    }
  );
};
