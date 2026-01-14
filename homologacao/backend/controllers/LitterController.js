const db = require('../models');

class LitterController {
    async create(req, res) {
        try {
            const litter = await db.Litter.create(req.body);
            res.status(201).json(litter);
        } catch (error) {
            console.error('Erro ao criar ninhada:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async findAll(req, res) {
        try {
            const litters = await db.Litter.findAll({
                include: [
                    { model: db.Animal, as: 'Father' },
                    { model: db.Animal, as: 'Mother' },
                    { model: db.Puppy, as: 'puppies' }
                ],
                order: [['expected_date', 'DESC'], ['birth_date', 'DESC']]
            });
            res.json(litters);
        } catch (error) {
            console.error('Erro ao listar ninhadas:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async findOne(req, res) {
        try {
            const { id } = req.params;
            const litter = await db.Litter.findByPk(id, {
                include: [
                    { model: db.Animal, as: 'Father' },
                    { model: db.Animal, as: 'Mother' },
                    { model: db.Puppy, as: 'puppies' },
                    { model: db.Reservation, as: 'reservations' }
                ]
            });

            if (!litter) {
                return res.status(404).json({ error: 'Ninhada não encontrada' });
            }

            res.json(litter);
        } catch (error) {
            console.error('Erro ao buscar ninhada:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const litter = await db.Litter.findByPk(id);

            if (!litter) {
                return res.status(404).json({ error: 'Ninhada não encontrada' });
            }

            await litter.update(req.body);
            res.json(litter);
        } catch (error) {
            console.error('Erro ao atualizar ninhada:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const litter = await db.Litter.findByPk(id);

            if (!litter) {
                return res.status(404).json({ error: 'Ninhada não encontrada' });
            }

            await litter.destroy();
            res.json({ message: 'Ninhada deletada com sucesso' });
        } catch (error) {
            console.error('Erro ao deletar ninhada:', error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new LitterController();
