const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "user_login_log",
    {
      log_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
      },
      login_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      logout_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "user_login_log",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "log_id" }],
        },
        {
          name: "fk_user_login_user",
          using: "BTREE",
          fields: [{ name: "user_id" }],
        },
      ],
    }
  );
};
