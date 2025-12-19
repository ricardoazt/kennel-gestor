'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class MedicalRecord extends Model {
        static associate(models) {
            MedicalRecord.belongsTo(models.Animal, { foreignKey: 'animal_id', as: 'animal' });
        }
    }

    MedicalRecord.init({
        tipo: {
            type: DataTypes.ENUM('Displasia', 'DNA', 'Exame', 'Outro'),
            allowNull: false
        },
        descricao: {
            type: DataTypes.STRING,
            allowNull: true
        },
        arquivo_path: {
            type: DataTypes.STRING,
            allowNull: false // O caminho do arquivo é obrigatório
        },
        data_exame: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'MedicalRecord',
        tableName: 'MedicalRecords'
    });

    return MedicalRecord;
};
