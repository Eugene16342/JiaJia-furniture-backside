module.exports = (sequelize, DataTypes) => {
  const UserDetail = sequelize.define(
    "user_detail",
    {
      user_id: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
      },
      first_name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      last_name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
    },
    {
      tableName: "user_detail",
      timestamps: false,
      underscored: true, // 將欄位名稱轉為蛇形命名法
    }
  );

  // 定義關聯
  UserDetail.associate = (models) => {
    UserDetail.belongsTo(models.users, {
      foreignKey: "user_id",
      targetKey: "user_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };

  return UserDetail;
};
