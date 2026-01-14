const db = require('../models');

class PuppyController {
    async create(req, res) {
        try {
            const puppy = await db.Puppy.create(req.body);
            res.status(201).json(puppy);
        } catch (error) {
            console.error('Erro ao criar filhote:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async findAll(req, res) {
        try {
            const { litter_id, status } = req.query;

            const where = {};
            if (litter_id) where.litter_id = litter_id;
            if (status) where.status = status;

            const puppies = await db.Puppy.findAll({
                where,
                include: [{ model: db.Litter, as: 'litter' }],
                order: [['gender', 'ASC'], ['name', 'ASC']]
            });

            res.json(puppies);
        } catch (error) {
            console.error('Erro ao listar filhotes:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async findOne(req, res) {
        try {
            const { id } = req.params;
            const puppy = await db.Puppy.findByPk(id, {
                include: [
                    { model: db.Litter, as: 'litter' },
                    { model: db.Reservation, as: 'reservation' }
                ]
            });

            if (!puppy) {
                return res.status(404).json({ error: 'Filhote não encontrado' });
            }

            res.json(puppy);
        } catch (error) {
            console.error('Erro ao buscar filhote:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const puppy = await db.Puppy.findByPk(id);

            if (!puppy) {
                return res.status(404).json({ error: 'Filhote não encontrado' });
            }

            await puppy.update(req.body);
            res.json(puppy);
        } catch (error) {
            console.error('Erro ao atualizar filhote:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const puppy = await db.Puppy.findByPk(id);

            if (!puppy) {
                return res.status(404).json({ error: 'Filhote não encontrado' });
            }

            await puppy.destroy();
            res.json({ message: 'Filhote deletado com sucesso' });
        } catch (error) {
            console.error('Erro ao deletar filhote:', error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new PuppyController();
