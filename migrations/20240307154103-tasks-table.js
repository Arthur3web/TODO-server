'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
      CREATE TABLE tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        timeStart TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        timeEnd TIMESTAMP NOT NULL,
        isCompleted BOOLEAN DEFAULT false
      );
      `)
  },

  async down (queryInterface, Sequelize) {
    // await queryInterface.dropTable('tasks');
    return queryInterface.sequelize.query(`
      DROP TABLE users;
    `);
  }
};
