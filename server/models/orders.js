const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "orders",
    {
      order_id: {
        type: DataTypes.CHAR(6),
        allowNull: false,
        primaryKey: true,
        comment: "亂數生成單號",
      },
      user_id: {
        type: DataTypes.CHAR(10),
        allowNull: true,
        references: {
          model: "users",
          key: "user_id",
        },
      },
      total_price: {
        type: DataTypes.DECIMAL(10, 0),
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "shipped", "delivered"),
        allowNull: false,
        defaultValue: "pending",
      },
      name: {
        // 新增的欄位
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      phone: {
        // 新增的欄位
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      email: {
        // 新增的欄位
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      payment: {
        // 新增的欄位
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      created_at: {
        // Sequelize 的 timestamps 欄位
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        onUpdate: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        // Sequelize 的 timestamps 欄位
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    },
    {
      sequelize,
      tableName: "orders",
      timestamps: true, // 開啟自動時間戳處理
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "order_id" }],
        },
        {
          name: "fk_orders_user",
          using: "BTREE",
          fields: [{ name: "user_id" }],
        },
      ],
    }
  );
};
