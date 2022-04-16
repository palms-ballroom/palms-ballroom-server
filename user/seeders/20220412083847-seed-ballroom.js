'use strict';
const fs = require('fs')

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     let data = JSON.parse(fs.readFileSync("./data/ballRoom.json", "utf-8"))
     data.forEach(element => {
       element.createdAt = new Date()
       element.updatedAt = new Date()
       element.bookDateStart = new Date(element.bookDateStart)
       element.bookDateEnd = new Date(element.bookDateEnd)
     });
     await queryInterface.bulkInsert("Transactions", data, {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete('Transactions', null, {});
  }
};
