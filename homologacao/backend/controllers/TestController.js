const db = require('../models');

module.exports = {
    // List all available test templates
    async indexTemplates(req, res) {
        try {
            const templates = await db.TestTemplate.findAll();
            return res.json(templates);
        } catch (error) {
            console.error('Error fetching test templates:', error);
            return res.status(500).json({ error: 'Erro ao buscar modelos de teste' });
        }
    },

    // Get details of a specific test template
    async showTemplate(req, res) {
        try {
            const template = await db.TestTemplate.findByPk(req.params.id);
            if (!template) {
                return res.status(404).json({ error: 'Modelo de teste não encontrado' });
            }
            return res.json(template);
        } catch (error) {
            console.error('Error fetching template details:', error);
            return res.status(500).json({ error: 'Erro ao buscar detalhes do teste' });
        }
    },

    // Save a test result for a puppy
    async storeResult(req, res) {
        try {
            const { puppy_id, test_template_id, evaluator, scores, notes, date } = req.body;

            // Validate if puppy and template exist
            const puppy = await db.Puppy.findByPk(puppy_id);
            if (!puppy) return res.status(404).json({ error: 'Filhote não encontrado' });

            const template = await db.TestTemplate.findByPk(test_template_id);
            if (!template) return res.status(404).json({ error: 'Modelo de teste não encontrado' });

            const result = await db.TestResult.create({
                puppy_id,
                test_template_id,
                evaluator,
                scores,
                notes,
                date: date || new Date()
            });

            return res.status(201).json(result);
        } catch (error) {
            console.error('Error saving test result:', error);
            return res.status(500).json({ error: 'Erro ao salvar resultado do teste' });
        }
    },

    // Get all results for a specific puppy
    async getResultsByPuppy(req, res) {
        try {
            const results = await db.TestResult.findAll({
                where: { puppy_id: req.params.puppy_id },
                include: [{
                    model: db.TestTemplate,
                    as: 'template'
                }],
                order: [['date', 'DESC']]
            });
            return res.json(results);
        } catch (error) {
            console.error('Error fetching results:', error);
            return res.status(500).json({ error: 'Erro ao buscar resultados' });
        }
    }
};
