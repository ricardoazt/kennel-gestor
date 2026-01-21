'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        const templates = [
            {
                name: 'Teste de Volhard (PAT)',
                description: 'Puppy Aptitude Test. Avalia 10 parâmetros de temperamento, interação social e aptidão para o trabalho. Ideal para ser realizado no 49º dia de vida.',
                parameters: JSON.stringify([
                    { name: 'Atração Social', description: 'Grau de interesse social e confiança.', min_score: 1, max_score: 6 },
                    { name: 'Seguir', description: 'Vontade de seguir a liderança humana.', min_score: 1, max_score: 6 },
                    { name: 'Contenção', description: 'Grau de dominância ou submissão física.', min_score: 1, max_score: 6 },
                    { name: 'Dominância Pelo Toque', description: 'Aceitação de manuseio e autoridade.', min_score: 1, max_score: 6 },
                    { name: 'Elevação', description: 'Controle emocional quando sem apoio.', min_score: 1, max_score: 6 },
                    { name: 'Busca', description: 'Disposição para trabalhar com humanos (cobro).', min_score: 1, max_score: 6 },
                    { name: 'Sensibilidade Tátil', description: 'Reação à pressão física nas patas.', min_score: 1, max_score: 6 },
                    { name: 'Sensibilidade Sonora', description: 'Reação a ruídos altos e repentinos.', min_score: 1, max_score: 6 },
                    { name: 'Sensibilidade Visual', description: 'Reação a objetos estranhos em movimento.', min_score: 1, max_score: 6 },
                    { name: 'Estabilidade', description: 'Reação a surpresas (guarda-chuva).', min_score: 1, max_score: 6 }
                ]),
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Teste de Campbell',
                description: 'Focado na identificação precoce de tendências à dominância ou submissão.',
                parameters: JSON.stringify([
                    { name: 'Atração Social', description: 'Vem prontamente, cauda alta (Dominante) ou hesita (Submisso).', min_score: 1, max_score: 5 },
                    { name: 'Seguir', description: 'Segue o avaliador prontamente.', min_score: 1, max_score: 5 },
                    { name: 'Contenção Física', description: 'Luta fortemente (Dominante) ou relaxa (Submisso).', min_score: 1, max_score: 5 },
                    { name: 'Dominação Social', description: 'Aceita carinho forçado ou reage.', min_score: 1, max_score: 5 },
                    { name: 'Elevação', description: 'Aceita ser levantado do chão.', min_score: 1, max_score: 5 }
                ]),
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Teste de Toman',
                description: 'Utilizado para medir a persistência e o instinto de presa (drive), fundamental para cães de trabalho.',
                parameters: JSON.stringify([
                    { name: 'Instinto de Presa', description: 'Interesse em perseguir objeto.', min_score: 1, max_score: 5 },
                    { name: 'Persistência', description: 'Quanto tempo mantém o interesse.', min_score: 1, max_score: 5 },
                    { name: 'Mordida', description: 'Qualidade da mordida no objeto.', min_score: 1, max_score: 5 },
                    { name: 'Possessividade', description: 'Vontade de manter o objeto.', min_score: 1, max_score: 5 }
                ]),
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Teste de Clothier (CARAT)',
                description: 'Analisa a reatividade e a resiliência emocional do filhote perante estímulos.',
                parameters: JSON.stringify([
                    { name: 'Reatividade', description: 'Velocidade de reação a novos estímulos.', min_score: 1, max_score: 5 },
                    { name: 'Resiliência', description: 'Velocidade de recuperação após susto.', min_score: 1, max_score: 5 },
                    { name: 'Foco Social', description: 'Interesse em pessoas vs ambiente.', min_score: 1, max_score: 5 },
                    { name: 'Uso do Olfato', description: 'Dependência do faro para explorar.', min_score: 1, max_score: 5 }
                ]),
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Teste de Bio Sensor (Super Cães)',
                description: 'Protocolo de estimulação precoce que mede a resposta neurológica ao estresse (Early Neurological Stimulation - ENS).',
                parameters: JSON.stringify([
                    { name: 'Estimulação Tátil', description: 'Reação ao toque de cotonete nas patas.', min_score: 1, max_score: 3 },
                    { name: 'Cabeça Erguida', description: 'Reação ao ser mantido verticalmente.', min_score: 1, max_score: 3 },
                    { name: 'Cabeça Para Baixo', description: 'Reação ao ser mantido invertido.', min_score: 1, max_score: 3 },
                    { name: 'Supino', description: 'Reação ao deitar de costas.', min_score: 1, max_score: 3 },
                    { name: 'Estimulação Térmica', description: 'Reação a superfície fria.', min_score: 1, max_score: 3 }
                ]),
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Teste de Aptidão para Pastoreio',
                description: 'Avalia o instinto natural de cerco e foco em animais de rebanho.',
                parameters: JSON.stringify([
                    { name: 'Interesse', description: 'Interesse inicial no rebanho (ovelhas/patos).', min_score: 1, max_score: 5 },
                    { name: 'Aproximação', description: 'Estilo de aproximação (cauteloso vs agressivo).', min_score: 1, max_score: 5 },
                    { name: 'Olho (Eye)', description: 'Uso do contato visual para controlar.', min_score: 1, max_score: 5 },
                    { name: 'Latido', description: 'Uso de latido durante o trabalho (indesejado em algumas raças).', min_score: 1, max_score: 5 },
                    { name: 'Equilíbrio', description: 'Instinto de ir para o lado oposto do condutor.', min_score: 1, max_score: 5 }
                ]),
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Teste de Seleção para Cães-Guia (PMP)',
                description: 'Foca na sensibilidade sonora, ausência de agressividade e vontade de agradar.',
                parameters: JSON.stringify([
                    { name: 'Sensibilidade Sonora', description: 'Ausência de medo de barulhos urbanos.', min_score: 1, max_score: 5 },
                    { name: 'Agressividade', description: 'Zero tolerância para agressividade.', min_score: 1, max_score: 5 },
                    { name: 'Distração', description: 'Capacidade de ignorar gatos/outros cães.', min_score: 1, max_score: 5 },
                    { name: 'Vontade de Agradar', description: 'Foco no condutor.', min_score: 1, max_score: 5 },
                    { name: 'Medo de Altura', description: 'Reação a plataformas elevadas.', min_score: 1, max_score: 5 }
                ]),
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Teste de Fisher',
                description: 'Avalia especificamente a aptidão social e a resposta inicial a estranhos.',
                parameters: JSON.stringify([
                    { name: 'Aproximação a Estranhos', description: 'Excitado, calmo ou medroso.', min_score: 1, max_score: 5 },
                    { name: 'Interação com Brinquedos', description: 'Posse e compartilhamento.', min_score: 1, max_score: 5 },
                    { name: 'Resposta à Dor', description: 'Limiar de dor e reação (grito/mordida).', min_score: 1, max_score: 5 },
                    { name: 'Apego', description: 'Preferência por ficar perto de humanos.', min_score: 1, max_score: 5 }
                ]),
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Teste de Pfaffenberger',
                description: 'Histórico e rigoroso, focado em prever o sucesso de cães em funções de serviço e guia.',
                parameters: JSON.stringify([
                    { name: 'Coragem', description: 'Enfrentamento de novidades.', min_score: 1, max_score: 5 },
                    { name: 'Inteligência Adaptativa', description: 'Resolução de problemas simples.', min_score: 1, max_score: 5 },
                    { name: 'Cooperação', description: 'Trabalho em equipe com humano.', min_score: 1, max_score: 5 },
                    { name: 'Estabilidade Emocional', description: 'Recuperação de estresse.', min_score: 1, max_score: 5 }
                ]),
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        await queryInterface.bulkInsert('TestTemplates', templates, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('TestTemplates', null, {});
    }
};
