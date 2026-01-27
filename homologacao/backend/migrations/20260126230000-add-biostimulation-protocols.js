'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Add ESI Protocol field
        await queryInterface.addColumn('Puppies', 'esi_protocol', {
            type: Sequelize.JSONB,
            defaultValue: {},
            allowNull: true,
            comment: 'Early Scent Introduction protocol tracking (days 3-16)'
        });

        // Add Sound Desensitization field
        await queryInterface.addColumn('Puppies', 'sound_desensitization', {
            type: Sequelize.JSONB,
            defaultValue: {},
            allowNull: true,
            comment: 'Sound exposure checklist (days 21-60)'
        });

        // Add Environmental Enrichment field
        await queryInterface.addColumn('Puppies', 'environmental_enrichment', {
            type: Sequelize.JSONB,
            defaultValue: {},
            allowNull: true,
            comment: 'Texture and surface exposure (days 25-60)'
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Puppies', 'esi_protocol');
        await queryInterface.removeColumn('Puppies', 'sound_desensitization');
        await queryInterface.removeColumn('Puppies', 'environmental_enrichment');
    }
};
