'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Litter extends Model {
        static associate(models) {
            // Association with Animals (Parents)
            Litter.belongsTo(models.Animal, { as: 'Father', foreignKey: 'father_id' });
            Litter.belongsTo(models.Animal, { as: 'Mother', foreignKey: 'mother_id' });

            // Association with Puppies
            Litter.hasMany(models.Puppy, {
                foreignKey: 'litter_id',
                as: 'puppies',
                onDelete: 'CASCADE'
            });

            // Association with Reservations
            Litter.hasMany(models.Reservation, {
                foreignKey: 'litter_id',
                as: 'reservations',
                onDelete: 'CASCADE'
            });
        }
    }

    Litter.init({
        father_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Animals',
                key: 'id'
            }
        },
        mother_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Animals',
                key: 'id'
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        birth_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        expected_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'planned',
            validate: {
                isIn: [['planned', 'pregnant', 'born', 'archived']]
            }
        },
        total_males: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        total_females: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        available_males: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        available_females: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    }, {
        sequelize,
        modelName: 'Litter',
        tableName: 'Litters'
    });

    return Litter;
};
