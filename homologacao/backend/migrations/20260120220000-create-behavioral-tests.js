'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Create TestTemplates table
        await queryInterface.createTable('TestTemplates', {
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
            description: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            parameters: {
                type: Sequelize.JSONB, // Array of objects: { name, description, min_score, max_score, scoring_guide }
                allowNull: false
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

        // Create TestResults table
        await queryInterface.createTable('TestResults', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            puppy_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Puppies',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            test_template_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'TestTemplates',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT' // Keep result even if template is somehow removed, or block removal
            },
            evaluator: {
                type: Sequelize.STRING,
                allowNull: true
            },
            date: {
                type: Sequelize.DATEONLY,
                allowNull: false,
                defaultValue: Sequelize.NOW
            },
            scores: {
                type: Sequelize.JSONB, // { parameter_name: score }
                allowNull: false
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
        await queryInterface.dropTable('TestResults');
        await queryInterface.dropTable('TestTemplates');
    }
};
