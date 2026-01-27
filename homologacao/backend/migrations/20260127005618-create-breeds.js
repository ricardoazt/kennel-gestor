'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create Breeds table
    await queryInterface.createTable('Breeds', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add breed_id to Animals table
    await queryInterface.addColumn('Animals', 'breed_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Breeds',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // Create index for better query performance
    await queryInterface.addIndex('Animals', ['breed_id']);
  },

  async down(queryInterface, Sequelize) {
    // Remove breed_id from Animals
    await queryInterface.removeColumn('Animals', 'breed_id');

    // Drop Breeds table
    await queryInterface.dropTable('Breeds');
  }
};
