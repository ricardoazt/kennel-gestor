'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('MediaAlbums', 'share_token', {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: true,
            unique: true
        });
        await queryInterface.addColumn('MediaAlbums', 'is_public', {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
            allowNull: false
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('MediaAlbums', 'share_token');
        await queryInterface.removeColumn('MediaAlbums', 'is_public');
    }
};
