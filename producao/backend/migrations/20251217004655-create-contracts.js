'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Contracts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      client_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Clients',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      puppy_id: {
        type: Sequelize.INTEGER
        // Reference added later to avoid circular dependency if Puppies not created yet, 
        // but typically we can define it here if Puppies table exists or we add constraint later.
        // For simplicity, assuming Puppies table will exist when running, or we use integer.
        // Better to add constraint if Puppies created. 
        // Since Puppies migration is later, I will just use INTEGER here and add constraint in Puppies or separate migration?
        // Actually, Puppies migration timestamp is 20251217004625, Contracts is 20251217004655.
        // So Puppies table WILL exist.
      },
      file_url: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'draft'
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
    await queryInterface.dropTable('Contracts');
  }
};
