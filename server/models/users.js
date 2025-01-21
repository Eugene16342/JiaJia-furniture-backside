module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "users",
    {
      user_id: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        primaryKey: true,
        comment: "使用Nano ID生成使用者ID\n",
      },
      user_name: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: "密碼使用哈希加密\n",
      },
      email: {
        type: DataTypes.STRING(200),
        allowNull: false,
        unique: "email_UNIQUE",
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      update_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      status: {
        type: DataTypes.ENUM("normal", "banned"),
        allowNull: false,
        defaultValue: "normal",
        comment: "帳號狀態，normal為正常，banned為停權",
      },
    },
    {
      sequelize,
      tableName: "users",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "user_id" }],
        },
        {
          name: "user_name_UNIQUE",
          unique: true,
          using: "BTREE",
          fields: [{ name: "user_name" }],
        },
        {
          name: "email_UNIQUE",
          unique: true,
          using: "BTREE",
          fields: [{ name: "email" }],
        },
      ],
    }
  );
};
