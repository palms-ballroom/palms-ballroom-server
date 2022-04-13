'use strict';
const fs = require('fs');
const { hashPassword } = require('../helpers/bcrypt');

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
     let data = JSON.parse(fs.readFileSync("./data/user.json", "utf-8"))
     data.forEach(element => {
       element.createdAt = new Date()
       element.updatedAt = new Date()
       element.password = hashPassword(element.password)
     });
     await queryInterface.bulkInsert("Users", data, {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete('Users', null, {});
  }
};
