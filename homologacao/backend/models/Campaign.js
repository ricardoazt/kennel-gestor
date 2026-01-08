'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Campaign extends Model {
        static associate(models) {
            // Campaign belongs to a template
            Campaign.belongsTo(models.CampaignTemplate, {
                foreignKey: 'template_id',
                as: 'template'
            });

            // Campaign created by user
            Campaign.belongsTo(models.User, {
                foreignKey: 'created_by',
                as: 'creator'
            });

            // Campaign can be related to a dog
            Campaign.belongsTo(models.Animal, {
                foreignKey: 'related_dog_id',
                as: 'relatedDog'
            });

            // Campaign has many media files
            Campaign.belongsToMany(models.MediaFile, {
                through: 'CampaignMedia',
                foreignKey: 'campaign_id',
                otherKey: 'media_file_id',
                as: 'mediaFiles'
            });
        }

        // Instance method to increment views
        async incrementViews() {
            this.views_count += 1;
            await this.save();
        }

        // Instance method to increment shares
        async incrementShares() {
            this.shares_count += 1;
            await this.save();
        }

        // Get public URL
        getPublicUrl() {
            return `/p/${this.slug}`;
        }
    }

    Campaign.init({
        title: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        slug: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        campaign_type: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                isIn: [['breeding', 'litter', 'availability', 'event', 'general']]
            }
        },
        template_id: {
            type: DataTypes.INTEGER
        },
        status: {
            type: DataTypes.STRING(50),
            defaultValue: 'draft',
            validate: {
                isIn: [['draft', 'published', 'archived']]
            }
        },
        content: {
            type: DataTypes.JSONB,
            allowNull: false
        },
        settings: {
            type: DataTypes.JSONB
        },
        seo_title: {
            type: DataTypes.STRING(255)
        },
        seo_description: {
            type: DataTypes.TEXT
        },
        og_image_path: {
            type: DataTypes.STRING(500)
        },
        related_dog_id: {
            type: DataTypes.INTEGER
        },
        related_litter_id: {
            type: DataTypes.INTEGER
        },
        views_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        shares_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        created_by: {
            type: DataTypes.INTEGER
        },
        published_at: {
            type: DataTypes.DATE
        }
    }, {
        sequelize,
        modelName: 'Campaign',
        tableName: 'Campaigns'
    });

    return Campaign;
};
