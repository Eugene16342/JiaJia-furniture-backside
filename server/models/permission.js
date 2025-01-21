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
      },
    },
    {
      tableName: "permissions",
      timestamps: false,
    }
  );
  return permission;
};
