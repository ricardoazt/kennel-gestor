'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('CampaignTemplates', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            description: {
                type: Sequelize.TEXT
            },
            template_type: {
                type: Sequelize.STRING(50),
                allowNull: false,
                comment: 'breeding, litter, availability, landing, gallery, event'
            },
            preview_image_path: {
                type: Sequelize.STRING(500)
            },
            default_content: {
                type: Sequelize.JSONB,
                allowNull: false,
                comment: 'Default module structure for this template'
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                defaultValue: true
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });

        await queryInterface.addIndex('CampaignTemplates', ['template_type']);
        await queryInterface.addIndex('CampaignTemplates', ['is_active']);
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('CampaignTemplates');
    }
};
