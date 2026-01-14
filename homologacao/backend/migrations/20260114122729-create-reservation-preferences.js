'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ReservationPreferences', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            reservation_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                unique: true,
                references: {
                    model: 'Reservations',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            preferred_gender: {
                type: Sequelize.ENUM('male', 'female', 'no_preference'),
                defaultValue: 'no_preference'
            },
            preferred_color: {
                type: Sequelize.STRING,
                allowNull: true
            },
            temperament_preference: {
                type: Sequelize.ENUM('calm', 'active', 'balanced', 'no_preference'),
                defaultValue: 'no_preference'
            },
            purpose: {
                type: Sequelize.ENUM('companion', 'breeding', 'show', 'guard', 'sport', 'other'),
                allowNull: true
            },
            additional_notes: {
                type: Sequelize.TEXT,
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

        await queryInterface.addIndex('ReservationPreferences', ['reservation_id']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('ReservationPreferences');
    }
};
