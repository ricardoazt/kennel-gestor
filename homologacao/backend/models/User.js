'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            // User can upload media files
            User.hasMany(models.MediaFile, {
                foreignKey: 'uploaded_by',
                as: 'uploadedMedia'
            });

            // User can create albums
            User.hasMany(models.MediaAlbum, {
                foreignKey: 'created_by',
                as: 'createdAlbums'
            });

            // User can create campaigns
            User.hasMany(models.Campaign, {
                foreignKey: 'created_by',
                as: 'createdCampaigns'
            });

            // User can have medical records
            if (models.MedicalRecord) {
                User.hasMany(models.MedicalRecord, {
                    foreignKey: 'created_by',
                    as: 'medicalRecords'
                });
            }

            // User can have agenda events
            if (models.AgendaEvent) {
                User.hasMany(models.AgendaEvent, {
                    foreignKey: 'created_by',
                    as: 'agendaEvents'
                });
            }
        }
    }

    User.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password_hash: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: 'staff',
            validate: {
                isIn: [['admin', 'staff', 'veterinarian', 'viewer']]
            }
        }
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'Users'
    });

    return User;
};
