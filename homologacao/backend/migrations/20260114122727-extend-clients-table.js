'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Add new fields to existing Clients table
        await queryInterface.addColumn('Clients', 'cpf', {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true
        });

        await queryInterface.addColumn('Clients', 'city', {
            type: Sequelize.STRING,
            allowNull: true
        });

        await queryInterface.addColumn('Clients', 'state', {
            type: Sequelize.STRING,
            allowNull: true
        });

        await queryInterface.addColumn('Clients', 'zipcode', {
            type: Sequelize.STRING,
            allowNull: true
        });

        await queryInterface.addColumn('Clients', 'notes', {
            type: Sequelize.TEXT,
            allowNull: true
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Clients', 'cpf');
        await queryInterface.removeColumn('Clients', 'city');
        await queryInterface.removeColumn('Clients', 'state');
        await queryInterface.removeColumn('Clients', 'zipcode');
        await queryInterface.removeColumn('Clients', 'notes');
    }
};
