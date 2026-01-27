'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        const defaultBreeds = [
            {
                name: 'Golden Retriever',
                description: 'Raça amigável, inteligente e confiável',
                active: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Labrador Retriever',
                description: 'Raça leal, versátil e amigável',
                active: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Pastor Alemão',
                description: 'Raça inteligente, versátil e leal',
                active: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Border Collie',
                description: 'Raça extremamente inteligente e energética',
                active: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Poodle',
                description: 'Raça inteligente, elegante e versátil',
                active: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Bulldog Francês',
                description: 'Raça companheira, adaptável e afetuosa',
                active: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Husky Siberiano',
                description: 'Raça energética, independente e amigável',
                active: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Rottweiler',
                description: 'Raça leal, confiante e corajosa',
                active: true,
                created_at: new Date(),
                updated_at: new Date()
            }
        ];

        await queryInterface.bulkInsert('Breeds', defaultBreeds, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Breeds', null, {});
    }
};
