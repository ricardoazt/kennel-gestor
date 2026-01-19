'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Puppies', 'lactation_status', {
            type: Sequelize.STRING,
            allowNull: true
        });
        await queryInterface.addColumn('Puppies', 'food_acceptance', {
            type: Sequelize.STRING,
            allowNull: true
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Puppies', 'lactation_status');
        await queryInterface.removeColumn('Puppies', 'food_acceptance');
    }
};
