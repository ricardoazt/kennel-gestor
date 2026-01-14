'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Reservations', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            client_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Clients',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            reservation_type: {
                type: Sequelize.ENUM('litter_choice', 'specific_puppy'),
                allowNull: false,
                defaultValue: 'litter_choice'
            },
            litter_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'Litters',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            puppy_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'Puppies',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            choice_priority: {
                type: Sequelize.STRING,
                allowNull: true,
                comment: 'Ex: "1º Escolha Macho", "2º Escolha Fêmea"'
            },
            choice_gender: {
                type: Sequelize.ENUM('male', 'female'),
                allowNull: true,
                comment: 'Gênero escolhido para reserva de ninhada'
            },
            total_value: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true
            },
            deposit_value: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
            },
            deposit_paid: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            deposit_paid_date: {
                type: Sequelize.DATE,
                allowNull: true
            },
            payment_method: {
                type: Sequelize.ENUM('pix', 'credit_card', 'bank_transfer', 'cash', 'other'),
                allowNull: true
            },
            payment_proof_url: {
                type: Sequelize.STRING,
                allowNull: true
            },
            status: {
                type: Sequelize.ENUM(
                    'awaiting_deposit',
                    'confirmed',
                    'contract_pending',
                    'active',
                    'completed',
                    'cancelled',
                    'expired'
                ),
                defaultValue: 'awaiting_deposit',
                allowNull: false
            },
            expires_at: {
                type: Sequelize.DATE,
                allowNull: true,
                comment: 'Auto-expiração para reservas aguardando sinal'
            },
            status_history: {
                type: Sequelize.JSONB,
                defaultValue: [],
                comment: 'Log de mudanças de status'
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

        // Add indexes for common queries
        await queryInterface.addIndex('Reservations', ['client_id']);
        await queryInterface.addIndex('Reservations', ['litter_id']);
        await queryInterface.addIndex('Reservations', ['puppy_id']);
        await queryInterface.addIndex('Reservations', ['status']);
        await queryInterface.addIndex('Reservations', ['expires_at']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Reservations');
    }
};
