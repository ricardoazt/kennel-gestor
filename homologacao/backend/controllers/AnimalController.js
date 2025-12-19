const { Animal, MedicalRecord } = require('../models');
const path = require('path');
const fs = require('fs');

// Fetch full lineage upwards (ancestors)
async function getAncestors(animalId, depth = 3) {
    if (depth === 0) return null;

    const animal = await Animal.findByPk(animalId, {
        include: [
            { model: Animal, as: 'Pai' },
            { model: Animal, as: 'Mae' }
        ]
    });

    if (!animal) return null;

    const result = animal.toJSON();

    if (result.pai_id) {
        result.Pai = await getAncestors(result.pai_id, depth - 1);
    }
    if (result.mae_id) {
        result.Mae = await getAncestors(result.mae_id, depth - 1);
    }

    return result;
}

module.exports = {
    // === Animal CRUD ===
    async create(req, res) {
        try {
            const animal = await Animal.create(req.body);
            return res.status(201).json(animal);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },

    async findAll(req, res) {
        try {
            const animals = await Animal.findAll();
            return res.json(animals);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async findOne(req, res) {
        try {
            const animal = await Animal.findByPk(req.params.id, {
                include: [{ model: MedicalRecord, as: 'medicalRecords' }]
            });

            if (!animal) return res.status(404).json({ error: 'Animal not found' });

            return res.json(animal);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const animal = await Animal.findByPk(req.params.id);
            if (!animal) return res.status(404).json({ error: 'Animal not found' });

            await animal.update(req.body);
            return res.json(animal);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },

    async delete(req, res) {
        try {
            const animal = await Animal.findByPk(req.params.id);
            if (!animal) return res.status(404).json({ error: 'Animal not found' });

            await animal.destroy();
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // === Lineage ===
    async getLineage(req, res) {
        try {
            const { id } = req.params;
            const { depth = 4 } = req.query; // Default depth of 4 generations

            const tree = await getAncestors(id, parseInt(depth));

            if (!tree) return res.status(404).json({ error: 'Animal not found' });

            return res.json(tree);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // === Medical Records ===
    async addMedicalRecord(req, res) {
        try {
            const { id } = req.params;
            const { tipo, descricao, data_exame } = req.body;

            if (!req.file) {
                return res.status(400).json({ error: 'File upload required' });
            }

            const animal = await Animal.findByPk(id);
            if (!animal) return res.status(404).json({ error: 'Animal not found' });

            const record = await MedicalRecord.create({
                animal_id: id,
                tipo,
                descricao,
                data_exame,
                arquivo_path: `/uploads/${req.file.filename}`
            });

            return res.status(201).json(record);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
};
