'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Pregnancies', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            father_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Animals',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            },
            mother_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Animals',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            },
            breeding_date: {
                type: Sequelize.DATEONLY,
                allowNull: false,
                comment: 'Data da última cruza registrada (ponto inicial da gestação)'
            },
            expected_birth_date: {
                type: Sequelize.DATEONLY,
                allowNull: true,
                comment: 'Data prevista do parto (calculada: breeding_date + 63 dias)'
            },
            actual_birth_date: {
                type: Sequelize.DATEONLY,
                allowNull: true,
                comment: 'Data real do parto'
            },
            status: {
                type: Sequelize.ENUM('pregnant', 'born', 'lost', 'cancelled'),
                defaultValue: 'pregnant',
                allowNull: false
            },
            observations: {
                type: Sequelize.TEXT,
                allowNull: true,
                comment: 'Observações sobre a gestação'
            },
            temperature_records: {
                type: Sequelize.JSON,
                allowNull: true,
                defaultValue: '[]',
                comment: 'Registro de curvas de temperatura durante a gestação'
            },
            ultrasound_records: {
                type: Sequelize.JSON,
                allowNull: true,
                defaultValue: '[]',
                comment: 'Registro de ultrassons durante a gestação'
            },
            weight_records: {
                type: Sequelize.JSON,
                allowNull: true,
                defaultValue: '[]',
                comment: 'Registro de peso da mãe durante a gestação'
            },
            medical_notes: {
                type: Sequelize.TEXT,
                allowNull: true,
                comment: 'Anotações médicas/veterinárias'
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

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Pregnancies');
    }
};
