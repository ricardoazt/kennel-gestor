'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('CampaignMedia', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            campaign_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Campaigns',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            media_file_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'MediaFiles',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            display_order: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            module_id: {
                type: Sequelize.STRING(100),
                comment: 'Which module this media belongs to'
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });

        await queryInterface.addIndex('CampaignMedia', ['campaign_id']);
        await queryInterface.addIndex('CampaignMedia', ['media_file_id']);
        await queryInterface.addIndex('CampaignMedia', ['campaign_id', 'display_order']);
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('CampaignMedia');
    }
};
