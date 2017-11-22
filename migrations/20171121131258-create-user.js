'use strict';
const users = require('../data/json/users.json');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      login: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      isActive: {
        type: Sequelize.BOOLEAN
      },
      name: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.STRING
      },
      company: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      phone: {
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
        queryInterface.bulkInsert('Users', users);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};