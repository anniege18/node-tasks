'use strict';
module.exports = (sequelize, DataTypes) => {
  var Review = sequelize.define('Review', {
    productId: {
      type: DataTypes.INTEGER,
        references: 'Products',
        referencesKey: 'id'
    },
    text: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        Review.belongsTo(models.Product, { foreignKey: 'productId', targetKey: 'id' });
      }
    }
  });
  return Review;
};