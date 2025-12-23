'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();

        await queryInterface.bulkInsert('Animals', [
            {
                nome: 'Rex von Haus',
                registro: 'CBKC-PA-2019-001234',
                sexo: 'Macho',
                data_nascimento: '2019-03-15',
                cor: 'Preto e Dourado',
                microchip: '982000456789',
                pai_id: null,
                mae_id: null,
                createdAt: now,
                updatedAt: now
            },
            {
                nome: 'Asha vom Berg',
                registro: 'CBKC-PA-2020-002345',
                sexo: 'Femea',
                data_nascimento: '2020-07-22',
                cor: 'Preto e Marrom',
                microchip: '982000567890',
                pai_id: null,
                mae_id: null,
                createdAt: now,
                updatedAt: now
            },
            {
                nome: 'Kaiser',
                registro: 'CBKC-PA-2018-003456',
                sexo: 'Macho',
                data_nascimento: '2018-11-08',
                cor: 'Preto e Dourado',
                microchip: '982000678901',
                pai_id: null,
                mae_id: null,
                createdAt: now,
                updatedAt: now
            },
            {
                nome: 'Luna vom Wald',
                registro: 'CBKC-PA-2021-004567',
                sexo: 'Femea',
                data_nascimento: '2021-05-30',
                cor: 'Preto e Marrom',
                microchip: '982000789012',
                pai_id: null,
                mae_id: null,
                createdAt: now,
                updatedAt: now
            },
            {
                nome: 'Bruno',
                registro: null, // Filhote ainda sem registro
                sexo: 'Macho',
                data_nascimento: '2023-02-14',
                cor: 'Preto e Dourado',
                microchip: '982000890123',
                pai_id: null,
                mae_id: null,
                createdAt: now,
                updatedAt: now
            },
            {
                nome: 'Freya von Stern',
                registro: 'CBKC-PA-2019-005678',
                sexo: 'Femea',
                data_nascimento: '2019-09-12',
                cor: 'Preto e Marrom',
                microchip: '982000901234',
                pai_id: null,
                mae_id: null,
                createdAt: now,
                updatedAt: now
            }
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Animals', {
            microchip: [
                '982000456789',
                '982000567890',
                '982000678901',
                '982000789012',
                '982000890123',
                '982000901234'
            ]
        }, {});
    }
};
