const db = require('../models');
const pdfService = require('../utils/pdfService');

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
            const litter = await db.Litter.findByPk(id, {
                include: [
                    { model: db.Reservation, as: 'reservations' }
                ]
            });

            if (!litter) {
                return res.status(404).json({ error: 'Ninhada não encontrada' });
            }

            // Check if there are active reservations
            const activeReservations = litter.reservations?.filter(r =>
                ['awaiting_deposit', 'confirmed', 'contract_pending', 'active'].includes(r.status)
            );

            if (activeReservations && activeReservations.length > 0) {
                return res.status(400).json({
                    error: 'Não é possível excluir esta ninhada pois existem reservas ativas. Por favor, cancele as reservas primeiro.',
                    activeReservationsCount: activeReservations.length
                });
            }

            await litter.destroy();
            res.json({ message: 'Ninhada deletada com sucesso' });
        } catch (error) {
            console.error('Erro ao deletar ninhada:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async generatePDF(req, res) {
        try {
            const { id } = req.params;
            const litter = await db.Litter.findByPk(id, {
                include: [
                    { model: db.Animal, as: 'Father' },
                    { model: db.Animal, as: 'Mother' },
                    { model: db.Puppy, as: 'puppies' }
                ]
            });

            if (!litter) {
                return res.status(404).json({ error: 'Ninhada não encontrada' });
            }

            const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            const pdfBuffer = await pdfService.generateLitterPDF(litter, baseUrl);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="ninhada-${litter.name || litter.id}.pdf"`);
            res.send(pdfBuffer);
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new LitterController();
