'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const templates = [
            {
                name: 'Anúncio de Prenhez',
                description: 'Template para anunciar cruzamento e prenhez esperada (ex: Lobo Vs Amora)',
                template_type: 'breeding',
                preview_image_path: null,
                default_content: JSON.stringify({
                    modules: [
                        { id: 'hero', type: 'hero', title: 'Prenhez Confirmada!', subtitle: 'Aguardando filhotes incríveis', background_type: 'image', settings: { height: 'large' } },
                        { id: 'parents', type: 'parent_showcase', title: 'Os Pais', layout: 'side-by-side' },
                        { id: 'details', type: 'text', title: 'Detalhes da Prenhez', content: 'Adicione informações sobre a prenhez, data prevista do parto, etc.' },
                        { id: 'countdown', type: 'countdown', title: 'Contagem Regressiva', target_date: null, label: 'Dias para o nascimento' },
                        { id: 'contact', type: 'cta', title: 'Interessado?', button_text: 'Entre em Contato', button_link: 'whatsapp', show_whatsapp: true }
                    ]
                }),
                is_active: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Anúncio de Ninhada',
                description: 'Template para anunciar nascimento de filhotes',
                template_type: 'litter',
                preview_image_path: null,
                default_content: JSON.stringify({
                    modules: [
                        { id: 'hero', type: 'hero', title: 'Ninhada Nascida!', subtitle: 'Filhotes lindos e saudáveis', background_type: 'image' },
                        { id: 'gallery', type: 'gallery', title: 'Galeria de Fotos', layout: 'grid', columns: 3 },
                        { id: 'details', type: 'text', title: 'Informações da Ninhada', content: 'Data de nascimento, quantidade de filhotes, etc.' },
                        { id: 'parents', type: 'parent_showcase', title: 'Os Pais', layout: 'compact' },
                        { id: 'availability', type: 'text', title: 'Disponibilidade', content: 'Informações sobre reservas e disponibilidade' },
                        { id: 'contact', type: 'cta', title: 'Faça sua Reserva', button_text: 'Reservar Filhote', show_whatsapp: true, show_phone: true }
                    ]
                }),
                is_active: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Filhotes Disponíveis',
                description: 'Template para mostrar filhotes disponíveis para venda',
                template_type: 'availability',
                preview_image_path: null,
                default_content: JSON.stringify({
                    modules: [
                        { id: 'hero', type: 'hero', title: 'Filhotes Disponíveis', subtitle: 'Encontre seu novo companheiro', background_type: 'gradient' },
                        { id: 'puppies', type: 'puppy_cards', title: 'Nossos Filhotes', layout: 'cards', show_price: true, show_status: true },
                        { id: 'info', type: 'text', title: 'Informações Importantes', content: 'Todos os filhotes vêm com vacinas, vermífugo, microchip e pedigree.' },
                        { id: 'gallery', type: 'gallery', title: 'Mais Fotos', layout: 'masonry' },
                        { id: 'contact', type: 'contact_form', title: 'Entre em Contato', show_form: true, show_whatsapp: true }
                    ]
                }),
                is_active: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Landing Page do Canil',
                description: 'Template completo para página principal do canil',
                template_type: 'landing',
                preview_image_path: null,
                default_content: JSON.stringify({
                    modules: [
                        { id: 'hero', type: 'hero', title: 'Bem-vindo ao Nosso Canil', subtitle: 'Criadores de cães de excelência', background_type: 'video', show_cta: true },
                        { id: 'about', type: 'text', title: 'Sobre Nós', content: 'História do canil, missão, valores...', layout: 'two-column' },
                        { id: 'dogs', type: 'gallery', title: 'Nosso Plantel', layout: 'grid', columns: 4 },
                        { id: 'achievements', type: 'text', title: 'Conquistas', content: 'Prêmios, títulos, reconhecimentos...' },
                        { id: 'testimonials', type: 'testimonials', title: 'Depoimentos', layout: 'carousel' },
                        { id: 'contact', type: 'contact_section', title: 'Fale Conosco', show_map: true, show_form: true, show_social: true }
                    ]
                }),
                is_active: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Galeria de Fotos',
                description: 'Template simples para galeria de fotos e vídeos',
                template_type: 'gallery',
                preview_image_path: null,
                default_content: JSON.stringify({
                    modules: [
                        { id: 'hero', type: 'hero', title: 'Galeria', subtitle: 'Confira nossas fotos e vídeos', background_type: 'gradient', height: 'medium' },
                        { id: 'gallery', type: 'gallery', title: '', layout: 'masonry', show_captions: true, lightbox: true },
                        { id: 'videos', type: 'video_gallery', title: 'Vídeos', layout: 'grid' },
                        { id: 'cta', type: 'cta', title: 'Gostou?', button_text: 'Entre em Contato', show_whatsapp: true }
                    ]
                }),
                is_active: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Anúncio de Evento',
                description: 'Template para divulgar eventos, exposições, etc.',
                template_type: 'event',
                preview_image_path: null,
                default_content: JSON.stringify({
                    modules: [
                        { id: 'hero', type: 'hero', title: 'Evento Especial', subtitle: 'Você está convidado!', background_type: 'image', height: 'large' },
                        { id: 'event_details', type: 'event_info', title: 'Detalhes do Evento', show_date: true, show_time: true, show_location: true, show_map: true },
                        { id: 'description', type: 'text', title: 'Sobre o Evento', content: 'Descrição detalhada do evento...' },
                        { id: 'gallery', type: 'gallery', title: 'Fotos', layout: 'grid', columns: 3 },
                        { id: 'registration', type: 'cta', title: 'Participe!', button_text: 'Fazer Inscrição', show_form: true }
                    ]
                }),
                is_active: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        await queryInterface.bulkInsert('CampaignTemplates', templates, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('CampaignTemplates', null, {});
    }
};
