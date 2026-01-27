'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Breed extends Model {
        static associate(models) {
            // Association with Animals
            Breed.hasMany(models.Animal, {
                foreignKey: 'breed_id',
                as: 'animals'
            });
        }
    }

    Breed.init({
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: {
                msg: 'Esta raça já está cadastrada'
            },
            validate: {
                notEmpty: {
                    msg: 'O nome da raça é obrigatório'
                },
                len: {
                    args: [2, 100],
                    msg: 'O nome da raça deve ter entre 2 e 100 caracteres'
                }
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Breed',
        tableName: 'Breeds',
        timestamps: true,
        underscored: true
    });

    return Breed;
};
