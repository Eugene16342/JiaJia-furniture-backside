const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "categories",
    {
      category_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      name_zh: {
        type: DataTypes.STRING(10), // 對應新增的中文名稱欄位
        allowNull: false,
        comment: "分類的中文名稱",
      },
    },
    {
      sequelize,
      tableName: "categories",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "category_id" }],
        },
      ],
    }
  );
};
