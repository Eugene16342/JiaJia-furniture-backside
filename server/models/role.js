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
  return role;
};
