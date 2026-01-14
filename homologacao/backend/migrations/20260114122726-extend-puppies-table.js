'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Add new fields to existing Puppies table
        await queryInterface.addColumn('Puppies', 'microchip', {
            type: Sequelize.STRING,
            allowNull: true
        });

        await queryInterface.addColumn('Puppies', 'birth_weight', {
            type: Sequelize.DECIMAL(5, 2),
            allowNull: true
        });

        await queryInterface.addColumn('Puppies', 'temperament_notes', {
            type: Sequelize.TEXT,
            allowNull: true
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Puppies', 'microchip');
        await queryInterface.removeColumn('Puppies', 'birth_weight');
        await queryInterface.removeColumn('Puppies', 'temperament_notes');
    }
};
