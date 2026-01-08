'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('MediaAlbums', 'access_count', {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false
        });
        await queryInterface.addColumn('MediaAlbums', 'is_link_active', {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
            allowNull: false
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('MediaAlbums', 'access_count');
        await queryInterface.removeColumn('MediaAlbums', 'is_link_active');
    }
};
