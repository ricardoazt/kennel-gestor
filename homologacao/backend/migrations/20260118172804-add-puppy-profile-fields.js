'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDefinition = await queryInterface.describeTable('Puppies');

    if (!tableDefinition.unique_code) {
      await queryInterface.addColumn('Puppies', 'unique_code', {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      });
    }

    if (!tableDefinition.qr_code_data) {
      await queryInterface.addColumn('Puppies', 'qr_code_data', {
        type: Sequelize.TEXT,
        allowNull: true
      });
    }

    if (!tableDefinition.collar_color) {
      await queryInterface.addColumn('Puppies', 'collar_color', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }

    if (!tableDefinition.coat_color) {
      await queryInterface.addColumn('Puppies', 'coat_color', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Puppies', 'unique_code');
    await queryInterface.removeColumn('Puppies', 'qr_code_data');
    await queryInterface.removeColumn('Puppies', 'collar_color');
    await queryInterface.removeColumn('Puppies', 'coat_color');
  }
};
