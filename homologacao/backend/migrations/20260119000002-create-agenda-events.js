'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('AgendaEvents', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            animal_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Animals',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            data: {
                type: Sequelize.DATE,
                allowNull: false
            },
            tipo: {
                type: Sequelize.STRING,
                allowNull: false
            },
            titulo: {
                type: Sequelize.STRING,
                allowNull: false
            },
            descricao: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            local: {
                type: Sequelize.STRING,
                allowNull: true
            },
            participantes: {
                type: Sequelize.STRING,
                allowNull: true
            },
            status: {
                type: Sequelize.ENUM('Agendado', 'Concluído', 'Cancelado'),
                defaultValue: 'Agendado'
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('AgendaEvents');
    }
};
