'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('WaitingLists', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            city: {
                type: Sequelize.STRING,
                allowNull: false
            },
            phone: {
                type: Sequelize.STRING,
                allowNull: true
            },
            email: {
                type: Sequelize.STRING,
                allowNull: true
            },
            gender_preference: {
                type: Sequelize.ENUM('male', 'female', 'any'),
                allowNull: false,
                defaultValue: 'any'
            },
            coloration_preference: {
                type: Sequelize.STRING,
                allowNull: true
            },
            breed_preference: {
                type: Sequelize.STRING,
                allowNull: true
            },
            status: {
                type: Sequelize.ENUM('active', 'contacted', 'converted', 'inactive'),
                allowNull: false,
                defaultValue: 'active'
            },
            notes: {
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
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('WaitingLists');
    }
};
