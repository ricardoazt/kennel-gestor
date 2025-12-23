'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class AgendaEvent extends Model {
        static associate(models) {
            AgendaEvent.belongsTo(models.Animal, { foreignKey: 'animal_id', as: 'animal' });
        }
    }

    AgendaEvent.init({
        animal_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        data: {
            type: DataTypes.DATE,
            allowNull: false
        },
        tipo: {
            type: DataTypes.STRING, // 'Exposição', 'Apresentação', 'Treinamento', 'Visita', 'Outro'
            allowNull: false
        },
        titulo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        descricao: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        local: {
            type: DataTypes.STRING,
            allowNull: true
        },
        participantes: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('Agendado', 'Concluído', 'Cancelado'),
            defaultValue: 'Agendado'
        }
    }, {
        sequelize,
        modelName: 'AgendaEvent',
        tableName: 'AgendaEvents'
    });

    return AgendaEvent;
};
