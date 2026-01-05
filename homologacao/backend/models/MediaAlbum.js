'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class MediaAlbum extends Model {
        static associate(models) {
            // Album has many media files
            MediaAlbum.hasMany(models.MediaFile, {
                foreignKey: 'album_id',
                as: 'mediaFiles'
            });

            // Album has a cover image
            MediaAlbum.belongsTo(models.MediaFile, {
                foreignKey: 'cover_image_id',
                as: 'coverImage'
            });

            // Album created by user
            MediaAlbum.belongsTo(models.User, {
                foreignKey: 'created_by',
                as: 'creator'
            });
        }
    }

    MediaAlbum.init({
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT
        },
        cover_image_id: {
            type: DataTypes.INTEGER
        },
        created_by: {
            type: DataTypes.INTEGER
        },
        share_token: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: true,
            unique: true
        },
        is_public: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        },
        is_hidden: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'MediaAlbum',
        tableName: 'MediaAlbums'
    });

    return MediaAlbum;
};
