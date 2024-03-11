'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        email: "12345@test.ru",
        password: '12345',
        timezone: "America/Los_Angeles"
      },
      {
        email: "123@test.ru",
        password: '12345',
        timezone: "Africa/Bissau"
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null)
  }
};
