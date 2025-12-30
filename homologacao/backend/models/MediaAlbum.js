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
        }
    }, {
        sequelize,
        modelName: 'MediaAlbum',
        tableName: 'MediaAlbums'
    });

    return MediaAlbum;
};
