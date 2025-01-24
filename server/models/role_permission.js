module.exports = (sequelize, DataTypes) => {
  const role_permission = sequelize.define(
    "role_permission",
    {
      role_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      permission_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
    },
    {
      tableName: "role_permissions",
      timestamps: false,
    }
  );

  // 建立與 Role 和 Permission 的關聯
  role_permission.associate = (models) => {
    role_permission.belongsTo(models.role, {
      foreignKey: "role_id",
      onDelete: "CASCADE",
    });
    role_permission.belongsTo(models.permission, {
      foreignKey: "permission_id",
      onDelete: "CASCADE",
    });
  };

  return role_permission;
};
