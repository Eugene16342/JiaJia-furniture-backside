const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('colors', {
    color_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    color_name: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: "color_name_UNIQUE"
    },
    hex_code: {
      type: DataTypes.STRING(7),
      allowNull: false,
      comment: "使用hex色碼來存放顏色",
      unique: "new_tablecol_UNIQUE"
    }
  }, {
    sequelize,
    tableName: 'colors',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "color_id" },
        ]
      },
      {
        name: "new_tablecol_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "hex_code" },
        ]
      },
      {
        name: "color_name_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "color_name" },
        ]
      },
    ]
  });
};
