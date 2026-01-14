'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ReservationPreferences extends Model {
        static associate(models) {
            // Association with Reservation
            ReservationPreferences.belongsTo(models.Reservation, {
                foreignKey: 'reservation_id',
                as: 'reservation'
            });
        }
    }

    ReservationPreferences.init({
        reservation_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            references: {
                model: 'Reservations',
                key: 'id'
            }
        },
        preferred_gender: {
            type: DataTypes.ENUM('male', 'female', 'no_preference'),
            defaultValue: 'no_preference'
        },
        preferred_color: {
            type: DataTypes.STRING,
            allowNull: true
        },
        temperament_preference: {
            type: DataTypes.ENUM('calm', 'active', 'balanced', 'no_preference'),
            defaultValue: 'no_preference'
        },
        purpose: {
            type: DataTypes.ENUM('companion', 'breeding', 'show', 'guard', 'sport', 'other'),
            allowNull: true
        },
        additional_notes: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'ReservationPreferences',
        tableName: 'ReservationPreferences'
    });

    return ReservationPreferences;
};
