'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Puppy extends Model {
        static associate(models) {
            // Association with Litter
            Puppy.belongsTo(models.Litter, { foreignKey: 'litter_id', as: 'litter' });

            // Association with Reservation
            Puppy.hasOne(models.Reservation, { foreignKey: 'puppy_id', as: 'reservation' });
        }
    }

    Puppy.init({
        litter_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Litters',
                key: 'id'
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isIn: [['male', 'female', 'Macho', 'Fêmea', 'Femea']]
            }
        },
        color: {
            type: DataTypes.STRING,
            allowNull: true
        },
        microchip: {
            type: DataTypes.STRING,
            allowNull: true
        },
        birth_weight: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true
        },
        temperament_notes: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'available',
            validate: {
                isIn: [['available', 'reserved', 'sold', 'unavailable']]
            }
        },
        weight_history: {
            type: DataTypes.JSONB,
            defaultValue: []
        },
        unique_code: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        qr_code_data: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        collar_color: {
            type: DataTypes.STRING,
            allowNull: true
        },
        coat_color: {
            type: DataTypes.STRING,
            allowNull: true
        },
        lactation_status: {
            type: DataTypes.STRING,
            allowNull: true
        },
        food_acceptance: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Puppy',
        tableName: 'Puppies'
    });

    return Puppy;
};
