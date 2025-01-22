module.exports = (sequelize, DataTypes) => {
  const admin = sequelize.define(
    "admin",
    {
      admin_id: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      role_id: {
        type: DataTypes.CHAR(3),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      tableName: "admin",
      timestamps: false,
    }
  );

  // 建立與 Role 的關聯
  admin.associate = (models) => {
    admin.belongsTo(models.role, {
      foreignKey: "role_id",
      as: "role",
      onDelete: "CASCADE",
    });
  };

  return admin;
};
