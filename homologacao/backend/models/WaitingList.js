'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class WaitingList extends Model {
        static associate(models) {
            // No associations for now
        }
    }

    WaitingList.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isEmail: true
            }
        },
        gender_preference: {
            type: DataTypes.ENUM('male', 'female', 'any'),
            allowNull: false,
            defaultValue: 'any'
        },
        coloration_preference: {
            type: DataTypes.STRING,
            allowNull: true
        },
        breed_preference: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('active', 'contacted', 'converted', 'inactive'),
            allowNull: false,
            defaultValue: 'active'
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'WaitingList',
        tableName: 'WaitingLists'
    });

    return WaitingList;
};
