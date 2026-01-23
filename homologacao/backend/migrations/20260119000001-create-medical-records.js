'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('MedicalRecords', {
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
            tipo: {
                type: Sequelize.ENUM('Displasia', 'DNA', 'Exame', 'Outro'),
                allowNull: false
            },
            descricao: {
                type: Sequelize.STRING,
                allowNull: true
            },
            arquivo_path: {
                type: Sequelize.STRING,
                allowNull: false
            },
            data_exame: {
                type: Sequelize.DATEONLY,
                allowNull: true
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
        await queryInterface.dropTable('MedicalRecords');
    }
};
