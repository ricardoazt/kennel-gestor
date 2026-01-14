'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Add new fields to existing Litters table
        await queryInterface.addColumn('Litters', 'name', {
            type: Sequelize.STRING,
            allowNull: true
        });

        await queryInterface.addColumn('Litters', 'expected_date', {
            type: Sequelize.DATEONLY,
            allowNull: true
        });

        await queryInterface.addColumn('Litters', 'total_males', {
            type: Sequelize.INTEGER,
            defaultValue: 0
        });

        await queryInterface.addColumn('Litters', 'total_females', {
            type: Sequelize.INTEGER,
            defaultValue: 0
        });

        await queryInterface.addColumn('Litters', 'available_males', {
            type: Sequelize.INTEGER,
            defaultValue: 0
        });

        await queryInterface.addColumn('Litters', 'available_females', {
            type: Sequelize.INTEGER,
            defaultValue: 0
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Litters', 'name');
        await queryInterface.removeColumn('Litters', 'expected_date');
        await queryInterface.removeColumn('Litters', 'total_males');
        await queryInterface.removeColumn('Litters', 'total_females');
        await queryInterface.removeColumn('Litters', 'available_males');
        await queryInterface.removeColumn('Litters', 'available_females');
    }
};
