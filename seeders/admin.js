'use strict';
const bcrypt = require('bcrypt');
const { User } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('Admin#123', 10); // replace with actual password
    await queryInterface.bulkInsert('Users', [{
      email: 'admin@yopmail.com', // replace with actual email
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', { email: 'admin@yopmail.com' }, {});
  }
};
