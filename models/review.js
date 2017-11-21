'use strict';
module.exports = (sequelize, DataTypes) => {
  var Review = sequelize.define('Review', {
    productId: DataTypes.INTEGER,
    text: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        console.log(models);
        Review.belongsTo(models.Product);
      }
    }
  });
  return Review;
};