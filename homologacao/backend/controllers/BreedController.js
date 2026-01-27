const db = require('../models');

class BreedController {
    // Get all breeds (with optional active filter)
    async findAll(req, res) {
        try {
            const { active } = req.query;

            const where = {};
            if (active !== undefined) {
                where.active = active === 'true';
            }

            const breeds = await db.Breed.findAll({
                where,
                include: [{
                    model: db.Animal,
                    as: 'animals',
                    attributes: ['id'] // Only count
                }],
                order: [['name', 'ASC']]
            });

            // Add animal count to each breed
            const breedsWithCount = breeds.map(breed => {
                const breedData = breed.toJSON();
                breedData.animal_count = breedData.animals?.length || 0;
                delete breedData.animals; // Remove the full array, keep only count
                return breedData;
            });

            res.json(breedsWithCount);
        } catch (error) {
            console.error('Error fetching breeds:', error);
            res.status(500).json({ error: error.message });
        }
    }

    // Get single breed
    async findOne(req, res) {
        try {
            const { id } = req.params;

            const breed = await db.Breed.findByPk(id, {
                include: [{
                    model: db.Animal,
                    as: 'animals',
                    attributes: ['id', 'nome']
                }]
            });

            if (!breed) {
                return res.status(404).json({ error: 'Raça não encontrada' });
            }

            const breedData = breed.toJSON();
            breedData.animal_count = breedData.animals?.length || 0;

            res.json(breedData);
        } catch (error) {
            console.error('Error fetching breed:', error);
            res.status(500).json({ error: error.message });
        }
    }

    // Create new breed
    async create(req, res) {
        try {
            const { name, description, active } = req.body;

            if (!name || name.trim() === '') {
                return res.status(400).json({ error: 'O nome da raça é obrigatório' });
            }

            const breed = await db.Breed.create({
                name: name.trim(),
                description,
                active: active !== undefined ? active : true
            });

            res.status(201).json(breed);
        } catch (error) {
            console.error('Error creating breed:', error);

            // Handle unique constraint error
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ error: 'Esta raça já está cadastrada' });
            }

            res.status(500).json({ error: error.message });
        }
    }

    // Update breed
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, description, active } = req.body;

            const breed = await db.Breed.findByPk(id);

            if (!breed) {
                return res.status(404).json({ error: 'Raça não encontrada' });
            }

            await breed.update({
                name: name?.trim() || breed.name,
                description: description !== undefined ? description : breed.description,
                active: active !== undefined ? active : breed.active
            });

            res.json(breed);
        } catch (error) {
            console.error('Error updating breed:', error);

            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ error: 'Esta raça já está cadastrada' });
            }

            res.status(500).json({ error: error.message });
        }
    }

    // Toggle active status
    async toggleActive(req, res) {
        try {
            const { id } = req.params;

            const breed = await db.Breed.findByPk(id);

            if (!breed) {
                return res.status(404).json({ error: 'Raça não encontrada' });
            }

            await breed.update({ active: !breed.active });

            res.json(breed);
        } catch (error) {
            console.error('Error toggling breed status:', error);
            res.status(500).json({ error: error.message });
        }
    }

    // Delete breed
    async delete(req, res) {
        try {
            const { id } = req.params;

            const breed = await db.Breed.findByPk(id, {
                include: [{
                    model: db.Animal,
                    as: 'animals',
                    attributes: ['id']
                }]
            });

            if (!breed) {
                return res.status(404).json({ error: 'Raça não encontrada' });
            }

            // Check if breed is being used
            const animalCount = breed.animals?.length || 0;
            if (animalCount > 0) {
                return res.status(400).json({
                    error: `Não é possível excluir esta raça pois existem ${animalCount} animais cadastrados com ela. Desative a raça ao invés de excluí-la.`
                });
            }

            await breed.destroy();

            res.json({ message: 'Raça excluída com sucesso' });
        } catch (error) {
            console.error('Error deleting breed:', error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new BreedController();
