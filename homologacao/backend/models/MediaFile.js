'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class MediaFile extends Model {
        static associate(models) {
            // Media file belongs to an album
            MediaFile.belongsTo(models.MediaAlbum, {
                foreignKey: 'album_id',
                as: 'album'
            });

            // Media file uploaded by user
            MediaFile.belongsTo(models.User, {
                foreignKey: 'uploaded_by',
                as: 'uploader'
            });

            // Media file can be in many campaigns
            MediaFile.belongsToMany(models.Campaign, {
                through: 'CampaignMedia',
                foreignKey: 'media_file_id',
                otherKey: 'campaign_id',
                as: 'campaigns'
            });
        }

        // Instance method to get full URL
        getUrl() {
            return `/uploads/media/${this.filename}`;
        }

        getThumbnailUrl() {
            return this.thumbnail_path ? `/uploads/media/${this.thumbnail_path}` : this.getUrl();
        }
    }

    MediaFile.init({
        filename: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        original_name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        file_path: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        file_type: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                isIn: [['image', 'video']]
            }
        },
        mime_type: {
            type: DataTypes.STRING(100)
        },
        file_size: {
            type: DataTypes.INTEGER
        },
        width: {
            type: DataTypes.INTEGER
        },
        height: {
            type: DataTypes.INTEGER
        },
        duration: {
            type: DataTypes.INTEGER
        },
        thumbnail_path: {
            type: DataTypes.STRING(500)
        },
        album_id: {
            type: DataTypes.INTEGER
        },
        tags: {
            type: DataTypes.ARRAY(DataTypes.TEXT),
            defaultValue: []
        },
        description: {
            type: DataTypes.TEXT
        },
        metadata: {
            type: DataTypes.JSONB
        },
        uploaded_by: {
            type: DataTypes.INTEGER
        }
    }, {
        sequelize,
        modelName: 'MediaFile',
        tableName: 'MediaFiles'
    });

    return MediaFile;
};
