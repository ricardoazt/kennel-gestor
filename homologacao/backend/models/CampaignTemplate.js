'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class CampaignTemplate extends Model {
        static associate(models) {
            // Template can be used by many campaigns
            CampaignTemplate.hasMany(models.Campaign, {
                foreignKey: 'template_id',
                as: 'campaigns'
            });
        }
    }

    CampaignTemplate.init({
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT
        },
        template_type: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                isIn: [['breeding', 'litter', 'availability', 'landing', 'gallery', 'event']]
            }
        },
        preview_image_path: {
            type: DataTypes.STRING(500)
        },
        default_content: {
            type: DataTypes.JSONB,
            allowNull: false
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        sequelize,
        modelName: 'CampaignTemplate',
        tableName: 'CampaignTemplates'
    });

    return CampaignTemplate;
};
