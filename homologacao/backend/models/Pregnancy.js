'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Pregnancy extends Model {
        static associate(models) {
            // Association with Animals (Parents)
            Pregnancy.belongsTo(models.Animal, { as: 'Father', foreignKey: 'father_id' });
            Pregnancy.belongsTo(models.Animal, { as: 'Mother', foreignKey: 'mother_id' });
        }
    }

    Pregnancy.init({
        father_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Animals',
                key: 'id'
            }
        },
        mother_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Animals',
                key: 'id'
            }
        },
        breeding_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            comment: 'Data da última cruza registrada (ponto inicial da gestação)'
        },
        expected_birth_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            comment: 'Data prevista do parto (calculada: breeding_date + 63 dias)'
        },
        actual_birth_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            comment: 'Data real do parto'
        },
        status: {
            type: DataTypes.ENUM('pregnant', 'born', 'lost', 'cancelled'),
            defaultValue: 'pregnant',
            allowNull: false
        },
        observations: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Observações sobre a gestação'
        },
        temperature_records: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: [],
            comment: 'Registro de curvas de temperatura durante a gestação'
        },
        ultrasound_records: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: [],
            comment: 'Registro de ultrassons durante a gestação'
        },
        weight_records: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: [],
            comment: 'Registro de peso da mãe durante a gestação'
        },
        medical_notes: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Anotações médicas/veterinárias'
        }
    }, {
        sequelize,
        modelName: 'Pregnancy',
        tableName: 'Pregnancies'
    });

    return Pregnancy;
};
