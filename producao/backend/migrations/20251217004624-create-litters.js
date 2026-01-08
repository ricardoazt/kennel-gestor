'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Litters', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      father_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Dogs',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      mother_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Dogs',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      birth_date: {
        type: Sequelize.DATEONLY
      },
      status: {
        type: Sequelize.STRING, // planned, pregnant, born
        defaultValue: 'planned'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Litters');
  }
};
