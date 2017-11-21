'use strict';
const promise = require('../helpers/parseCSV');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.TEXT
      },
      brand: {
        type: Sequelize.TEXT
      },
      company: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.STRING
      },
      isbn: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    }).then(() => {
        promise.then((data) => {
          queryInterface.bulkInsert('Products', data);
        });
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Products');
  }
};