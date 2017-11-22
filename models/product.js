'use strict';
module.exports = (sequelize, DataTypes) => {
  var Product = sequelize.define('Product', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: DataTypes.TEXT,
    brand: DataTypes.TEXT,
    company: DataTypes.STRING,
    price: DataTypes.STRING,
    isbn: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
          Product.hasMany(models.Review, { foreignKey: 'productId', sourceKey: 'id' });
      }
    }
  });
  return Product;
};