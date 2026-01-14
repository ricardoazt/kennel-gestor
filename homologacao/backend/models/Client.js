'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Client extends Model {
        static associate(models) {
            // Association with Reservations
            Client.hasMany(models.Reservation, { foreignKey: 'client_id', as: 'reservations' });
        }
    }

    Client.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isEmail: true
            }
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        cpf: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true
        },
        state: {
            type: DataTypes.STRING,
            allowNull: true
        },
        zipcode: {
            type: DataTypes.STRING,
            allowNull: true
        },
        type: {
            type: DataTypes.STRING,
            defaultValue: 'waiting_list',
            validate: {
                isIn: [['lead', 'waiting_list', 'active_buyer', 'past_buyer']]
            }
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'active',
            validate: {
                isIn: [['active', 'inactive', 'blacklisted']]
            }
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Client',
        tableName: 'Clients'
    });

    return Client;
};
