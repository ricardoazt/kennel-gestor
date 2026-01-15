'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Remove existing foreign keys pointing to Dogs
        await queryInterface.removeConstraint('Litters', 'Litters_father_id_fkey');
        await queryInterface.removeConstraint('Litters', 'Litters_mother_id_fkey');

        // Add new foreign keys pointing to Animals
        await queryInterface.addConstraint('Litters', {
            fields: ['father_id'],
            type: 'foreign key',
            name: 'Litters_father_id_fkey',
            references: {
                table: 'Animals',
                field: 'id'
            },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        });

        await queryInterface.addConstraint('Litters', {
            fields: ['mother_id'],
            type: 'foreign key',
            name: 'Litters_mother_id_fkey',
            references: {
                table: 'Animals',
                field: 'id'
            },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        });
    },

    async down(queryInterface, Sequelize) {
        // Revert changes: Remove FKs pointing to Animals
        await queryInterface.removeConstraint('Litters', 'Litters_father_id_fkey');
        await queryInterface.removeConstraint('Litters', 'Litters_mother_id_fkey');

        // Add back FKs pointing to Dogs
        await queryInterface.addConstraint('Litters', {
            fields: ['father_id'],
            type: 'foreign key',
            name: 'Litters_father_id_fkey',
            references: {
                table: 'Dogs',
                field: 'id'
            },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        });

        await queryInterface.addConstraint('Litters', {
            fields: ['mother_id'],
            type: 'foreign key',
            name: 'Litters_mother_id_fkey',
            references: {
                table: 'Dogs',
                field: 'id'
            },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        });
    }
};
