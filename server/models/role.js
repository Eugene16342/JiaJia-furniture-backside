module.exports = (sequelize, DataTypes) => {
  const role = sequelize.define(
    "role",
    {
      role_id: {
        type: DataTypes.CHAR(3),
        primaryKey: true,
      },
      role_name: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
    },
    {
      tableName: "role",
      timestamps: false,
    }
  );

  // 建立與 Admin 的關聯
  role.associate = (models) => {
    role.hasMany(models.admin, {
      foreignKey: "role_id",
      as: "admins", // 明確指定別名
    });

    // 多對多關聯，與 permission 的關聯
    role.belongsToMany(models.permission, {
      through: "role_permission", // 中間表名稱
      foreignKey: "role_id",
      otherKey: "permission_id",
      as: "permissions",
      timestamps: false,
    });
  };
  return role;
};
