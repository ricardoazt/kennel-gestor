'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ReservationDocuments', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            reservation_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Reservations',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            document_type: {
                type: Sequelize.ENUM('contract', 'deposit_receipt', 'full_receipt', 'other'),
                allowNull: false
            },
            file_url: {
                type: Sequelize.STRING,
                allowNull: false
            },
            generated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            },
            generated_by_user_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'Users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
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

        await queryInterface.addIndex('ReservationDocuments', ['reservation_id']);
        await queryInterface.addIndex('ReservationDocuments', ['document_type']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('ReservationDocuments');
    }
};
