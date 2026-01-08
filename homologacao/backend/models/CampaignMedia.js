'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class CampaignMedia extends Model {
        static associate(models) {
            // This is a junction table, associations are defined in Campaign and MediaFile
        }
    }

    CampaignMedia.init({
        campaign_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        media_file_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        display_order: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        module_id: {
            type: DataTypes.STRING(100)
        }
    }, {
        sequelize,
        modelName: 'CampaignMedia',
        tableName: 'CampaignMedia',
        timestamps: true,
        updatedAt: false
    });

    return CampaignMedia;
};
