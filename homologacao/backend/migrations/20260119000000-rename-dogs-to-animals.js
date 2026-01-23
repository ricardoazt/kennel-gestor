'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Verificar se a tabela Dogs existe
        const tables = await queryInterface.showAllTables();

        if (tables.includes('Dogs')) {
            // Renomear tabela Dogs para Animals
            await queryInterface.renameTable('Dogs', 'Animals');

            // Renomear colunas para português
            await queryInterface.renameColumn('Animals', 'name', 'nome');
            await queryInterface.renameColumn('Animals', 'registration_number', 'registro');
            await queryInterface.renameColumn('Animals', 'birth_date', 'data_nascimento');

            // Remover coluna gender antiga
            await queryInterface.removeColumn('Animals', 'gender');

            // Adicionar coluna sexo com ENUM
            await queryInterface.addColumn('Animals', 'sexo', {
                type: Sequelize.ENUM('Macho', 'Femea'),
                allowNull: false,
                defaultValue: 'Macho'
            });

            // Adicionar colunas de referência para pais
            await queryInterface.addColumn('Animals', 'pai_id', {
                type: Sequelize.INTEGER,
                references: { model: 'Animals', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
                allowNull: true
            });

            await queryInterface.addColumn('Animals', 'mae_id', {
                type: Sequelize.INTEGER,
                references: { model: 'Animals', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
                allowNull: true
            });

            // Adicionar campo photos
            await queryInterface.addColumn('Animals', 'photos', {
                type: Sequelize.JSON,
                allowNull: true,
                defaultValue: []
            });

            // Remover colunas não utilizadas
            const columnList = await queryInterface.describeTable('Animals');
            if (columnList.breed) {
                await queryInterface.removeColumn('Animals', 'breed');
            }
            if (columnList.status) {
                await queryInterface.removeColumn('Animals', 'status');
            }
        } else {
            // Se a tabela Dogs não existe, criar Animals do zero
            await queryInterface.createTable('Animals', {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER
                },
                nome: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                registro: {
                    type: Sequelize.STRING,
                    allowNull: true
                },
                sexo: {
                    type: Sequelize.ENUM('Macho', 'Femea'),
                    allowNull: false
                },
                data_nascimento: {
                    type: Sequelize.DATEONLY,
                    allowNull: true
                },
                cor: {
                    type: Sequelize.STRING,
                    allowNull: true
                },
                microchip: {
                    type: Sequelize.STRING,
                    allowNull: true
                },
                pai_id: {
                    type: Sequelize.INTEGER,
                    references: { model: 'Animals', key: 'id' },
                    onUpdate: 'CASCADE',
                    onDelete: 'SET NULL',
                    allowNull: true
                },
                mae_id: {
                    type: Sequelize.INTEGER,
                    references: { model: 'Animals', key: 'id' },
                    onUpdate: 'CASCADE',
                    onDelete: 'SET NULL',
                    allowNull: true
                },
                photos: {
                    type: Sequelize.JSON,
                    allowNull: true,
                    defaultValue: []
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
        }
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Animals');
    }
};
