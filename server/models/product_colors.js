const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('product_colors', {
    product_color_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products_info',
        key: 'product_id'
      }
    },
    color_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'colors',
        key: 'color_id'
      }
    }
  }, {
    sequelize,
    tableName: 'product_colors',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "product_color_id" },
        ]
      },
      {
        name: "unique_product_color",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "product_id" },
          { name: "color_id" },
        ]
      },
      {
        name: "fk_product_colors_color",
        using: "BTREE",
        fields: [
          { name: "color_id" },
        ]
      },
    ]
  });
};
