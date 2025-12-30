'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Campaigns', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            title: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            slug: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true
            },
            campaign_type: {
                type: Sequelize.STRING(50),
                allowNull: false,
                comment: 'breeding, litter, availability, event, general'
            },
            template_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'CampaignTemplates',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            status: {
                type: Sequelize.STRING(50),
                defaultValue: 'draft',
                comment: 'draft, published, archived'
            },
            content: {
                type: Sequelize.JSONB,
                allowNull: false,
                comment: 'Modular content structure'
            },
            settings: {
                type: Sequelize.JSONB,
                comment: 'Campaign-specific settings'
            },
            seo_title: {
                type: Sequelize.STRING(255)
            },
            seo_description: {
                type: Sequelize.TEXT
            },
            og_image_path: {
                type: Sequelize.STRING(500),
                comment: 'Open Graph preview image'
            },
            related_dog_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Dogs',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            related_litter_id: {
                type: Sequelize.INTEGER,
                comment: 'Future: reference to litters table'
            },
            views_count: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            shares_count: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            created_by: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            published_at: {
                type: Sequelize.DATE
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

        await queryInterface.addIndex('Campaigns', ['slug'], { unique: true });
        await queryInterface.addIndex('Campaigns', ['campaign_type']);
        await queryInterface.addIndex('Campaigns', ['status']);
        await queryInterface.addIndex('Campaigns', ['created_by']);
        await queryInterface.addIndex('Campaigns', ['published_at']);
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Campaigns');
    }
};
