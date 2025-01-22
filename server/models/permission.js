module.exports = (sequelize, DataTypes) => {
  const permission = sequelize.define(
    "permission",
    {
      permission_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      permission_name: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true,
      },
      path: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true,
      },
      icon: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      parent_id: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
    },
    {
      tableName: "permissions",
      timestamps: false,
    }
  );

  // 建立關聯
  permission.associate = (models) => {
    // 自關聯 用於多層級結構
    permission.hasMany(models.permission, {
      foreignKey: "parent_id",
      as: "children",
    });

    permission.belongsTo(models.permission, {
      foreignKey: "parent_id",
      as: "parent",
    });

    // 與角色的多對多關係 (通過 role_permission 表)
    permission.belongsToMany(models.role, {
      through: "role_permission", // 中間表名稱
      foreignKey: "permission_id",
      otherKey: "role_id",
      as: "roles",
      timestamps: false,
    });
  };

  return permission;
};
