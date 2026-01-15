const db = require('../models');
const { Op } = require('sequelize');

const PregnancyController = {
    // Create new pregnancy
    async create(req, res) {
        try {
            const { father_id, mother_id, breeding_date, observations } = req.body;

            // Validate that both parents exist and are active
            const father = await db.Animal.findByPk(father_id);
            const mother = await db.Animal.findByPk(mother_id);

            if (!father || !mother) {
                return res.status(404).json({ error: 'Pai ou mãe não encontrado' });
            }

            // Validate sexo
            if (father.sexo !== 'Macho') {
                return res.status(400).json({ error: 'O pai deve ser do sexo Macho' });
            }
            if (mother.sexo !== 'Femea') {
                return res.status(400).json({ error: 'A mãe deve ser do sexo Femea' });
            }

            // Calculate expected birth date (breeding_date + 63 days)
            const breedingDate = new Date(breeding_date);
            const expectedBirthDate = new Date(breedingDate);
            expectedBirthDate.setDate(expectedBirthDate.getDate() + 63);

            const pregnancy = await db.Pregnancy.create({
                father_id,
                mother_id,
                breeding_date,
                expected_birth_date: expectedBirthDate.toISOString().split('T')[0],
                observations,
                status: 'pregnant'
            });

            // Load associations
            const pregnancyWithDetails = await db.Pregnancy.findByPk(pregnancy.id, {
                include: [
                    { model: db.Animal, as: 'Father', attributes: ['id', 'nome', 'registro', 'sexo', 'photos'] },
                    { model: db.Animal, as: 'Mother', attributes: ['id', 'nome', 'registro', 'sexo', 'photos'] }
                ]
            });

            res.status(201).json(pregnancyWithDetails);
        } catch (error) {
            console.error('Error creating pregnancy:', error);
            res.status(500).json({ error: 'Erro ao criar gestação', details: error.message });
        }
    },

    // Get all pregnancies
    async findAll(req, res) {
        try {
            const { status } = req.query;

            let whereClause = {};
            if (status) {
                whereClause.status = status;
            }

            const pregnancies = await db.Pregnancy.findAll({
                where: whereClause,
                include: [
                    { model: db.Animal, as: 'Father', attributes: ['id', 'nome', 'registro', 'sexo', 'photos'] },
                    { model: db.Animal, as: 'Mother', attributes: ['id', 'nome', 'registro', 'sexo', 'photos'] }
                ],
                order: [['breeding_date', 'DESC']]
            });

            res.json(pregnancies);
        } catch (error) {
            console.error('Error fetching pregnancies:', error);
            res.status(500).json({ error: 'Erro ao buscar gestações', details: error.message });
        }
    },

    // Get single pregnancy by ID
    async findOne(req, res) {
        try {
            const { id } = req.params;

            const pregnancy = await db.Pregnancy.findByPk(id, {
                include: [
                    { model: db.Animal, as: 'Father', attributes: ['id', 'nome', 'registro', 'sexo', 'photos', 'data_nascimento'] },
                    { model: db.Animal, as: 'Mother', attributes: ['id', 'nome', 'registro', 'sexo', 'photos', 'data_nascimento'] }
                ]
            });

            if (!pregnancy) {
                return res.status(404).json({ error: 'Gestação não encontrada' });
            }

            res.json(pregnancy);
        } catch (error) {
            console.error('Error fetching pregnancy:', error);
            res.status(500).json({ error: 'Erro ao buscar gestação', details: error.message });
        }
    },

    // Update pregnancy
    async update(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const pregnancy = await db.Pregnancy.findByPk(id);
            if (!pregnancy) {
                return res.status(404).json({ error: 'Gestação não encontrada' });
            }

            // If breeding_date is updated, recalculate expected_birth_date
            if (updateData.breeding_date && updateData.breeding_date !== pregnancy.breeding_date) {
                const breedingDate = new Date(updateData.breeding_date);
                const expectedBirthDate = new Date(breedingDate);
                expectedBirthDate.setDate(expectedBirthDate.getDate() + 63);
                updateData.expected_birth_date = expectedBirthDate.toISOString().split('T')[0];
            }

            await pregnancy.update(updateData);

            // Reload with associations
            const updatedPregnancy = await db.Pregnancy.findByPk(id, {
                include: [
                    { model: db.Animal, as: 'Father', attributes: ['id', 'nome', 'registro', 'sexo', 'photos'] },
                    { model: db.Animal, as: 'Mother', attributes: ['id', 'nome', 'registro', 'sexo', 'photos'] }
                ]
            });

            res.json(updatedPregnancy);
        } catch (error) {
            console.error('Error updating pregnancy:', error);
            res.status(500).json({ error: 'Erro ao atualizar gestação', details: error.message });
        }
    },

    // Delete pregnancy
    async delete(req, res) {
        try {
            const { id } = req.params;

            const pregnancy = await db.Pregnancy.findByPk(id);
            if (!pregnancy) {
                return res.status(404).json({ error: 'Gestação não encontrada' });
            }

            await pregnancy.destroy();
            res.json({ message: 'Gestação deletada com sucesso' });
        } catch (error) {
            console.error('Error deleting pregnancy:', error);
            res.status(500).json({ error: 'Erro ao deletar gestação', details: error.message });
        }
    },

    // Update status
    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status, actual_birth_date } = req.body;

            const pregnancy = await db.Pregnancy.findByPk(id);
            if (!pregnancy) {
                return res.status(404).json({ error: 'Gestação não encontrada' });
            }

            const updateData = { status };
            if (status === 'born' && actual_birth_date) {
                updateData.actual_birth_date = actual_birth_date;
            }

            await pregnancy.update(updateData);

            const updatedPregnancy = await db.Pregnancy.findByPk(id, {
                include: [
                    { model: db.Animal, as: 'Father', attributes: ['id', 'nome', 'registro', 'sexo', 'photos'] },
                    { model: db.Animal, as: 'Mother', attributes: ['id', 'nome', 'registro', 'sexo', 'photos'] }
                ]
            });

            res.json(updatedPregnancy);
        } catch (error) {
            console.error('Error updating pregnancy status:', error);
            res.status(500).json({ error: 'Erro ao atualizar status da gestação', details: error.message });
        }
    }
};

module.exports = PregnancyController;
