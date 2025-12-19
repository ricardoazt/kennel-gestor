'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Animal extends Model {
        static associate(models) {
            // Recursive associations for lineage
            Animal.belongsTo(models.Animal, { as: 'Pai', foreignKey: 'pai_id' });
            Animal.belongsTo(models.Animal, { as: 'Mae', foreignKey: 'mae_id' });
            Animal.hasMany(models.Animal, { as: 'FilhosPai', foreignKey: 'pai_id' });
            Animal.hasMany(models.Animal, { as: 'FilhosMae', foreignKey: 'mae_id' });

            // Association with Medical Records
            Animal.hasMany(models.MedicalRecord, { foreignKey: 'animal_id', as: 'medicalRecords' });
        }
    }

    Animal.init({
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        },
        registro: {
            type: DataTypes.STRING,
            allowNull: true // Pode ser filhote sem registro ainda
        },
        sexo: {
            type: DataTypes.ENUM('Macho', 'Femea'),
            allowNull: false
        },
        data_nascimento: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        cor: {
            type: DataTypes.STRING,
            allowNull: true
        },
        microchip: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Animal',
        tableName: 'Animals'
    });

    return Animal;
};
