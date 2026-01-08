'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ShareLink extends Model {
        static associate(models) {
            // ShareLink belongs to MediaAlbum
            ShareLink.belongsTo(models.MediaAlbum, {
                foreignKey: 'album_id',
                as: 'album'
            });
        }

        // Check if link is expired
        isExpired() {
            if (!this.expires_at) return false;
            return new Date() > new Date(this.expires_at);
        }

        // Check if link is valid (active and not expired)
        isValid() {
            return this.is_active && !this.isExpired();
        }
    }

    ShareLink.init({
        album_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        token: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        },
        access_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'ShareLink',
        tableName: 'ShareLinks'
    });

    return ShareLink;
};
