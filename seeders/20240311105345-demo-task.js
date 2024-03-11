'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tasks', [
      {
        title: "купить хлеб",
        userid: 1,
        iscompleted: true,
        timeend: "2024-03-11T20:31:59.000Z"
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tasks", null)
  }
};
