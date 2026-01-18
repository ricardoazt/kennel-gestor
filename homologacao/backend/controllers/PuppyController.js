const db = require('../models');
const qrCodeService = require('../utils/qrCodeService');
const crypto = require('crypto');

/**
 * Generate unique code for puppy
 */
function generateUniqueCode() {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = crypto.randomBytes(2).toString('hex').toUpperCase();
    return `${date}-${random}`;
}

class PuppyController {
    async create(req, res) {
        try {
            // Generate unique code
            const uniqueCode = generateUniqueCode();

            // Generate QR code
            const qrUrl = qrCodeService.generatePuppyProfileURL(uniqueCode);
            const qrCodeData = await qrCodeService.generateQRCode(qrUrl);

            const puppyData = {
                ...req.body,
                unique_code: uniqueCode,
                qr_code_data: qrCodeData
            };

            const puppy = await db.Puppy.create(puppyData);
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

    async findByCode(req, res) {
        try {
            const { code } = req.params;
            const puppy = await db.Puppy.findOne({
                where: { unique_code: code },
                include: [
                    {
                        model: db.Litter,
                        as: 'litter',
                        include: [
                            { model: db.Animal, as: 'Father' },
                            { model: db.Animal, as: 'Mother' }
                        ]
                    },
                    { model: db.Reservation, as: 'reservation' }
                ]
            });

            if (!puppy) {
                return res.status(404).json({ error: 'Filhote não encontrado' });
            }

            res.json(puppy);
        } catch (error) {
            console.error('Erro ao buscar filhote por código:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async addWeightEntry(req, res) {
        try {
            const { id } = req.params;
            const { weight, date } = req.body;

            if (!weight || !date) {
                return res.status(400).json({ error: 'Peso e data são obrigatórios' });
            }

            const puppy = await db.Puppy.findByPk(id);
            if (!puppy) {
                return res.status(404).json({ error: 'Filhote não encontrado' });
            }

            // Create a NEW array reference so Sequelize detects the change
            const weightHistory = [...(puppy.weight_history || [])];
            weightHistory.push({ weight: parseFloat(weight), date, recorded_at: new Date() });

            // Sort by date
            weightHistory.sort((a, b) => new Date(a.date) - new Date(b.date));

            await puppy.update({ weight_history: weightHistory });
            res.json(puppy);
        } catch (error) {
            console.error('Erro ao adicionar pesagem:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async removeWeightEntry(req, res) {
        try {
            const { id } = req.params;
            const { weight, date, recorded_at } = req.body;

            const puppy = await db.Puppy.findByPk(id);
            if (!puppy) {
                return res.status(404).json({ error: 'Filhote não encontrado' });
            }

            let weightHistory = puppy.weight_history || [];
            const initialLength = weightHistory.length;

            // Filter out the entry to delete
            // We use loose comparison for weight/date/recorded_at to ensure we match correctly
            weightHistory = weightHistory.filter(entry => {
                // If recorded_at is provided, simplify match using equality check on primitive values
                // or check if ALL fields match
                const isMatch =
                    parseFloat(entry.weight) === parseFloat(weight) &&
                    new Date(entry.date).toISOString().split('T')[0] === new Date(date).toISOString().split('T')[0] &&
                    (recorded_at ? new Date(entry.recorded_at).getTime() === new Date(recorded_at).getTime() : true);

                return !isMatch;
            });

            if (weightHistory.length === initialLength) {
                return res.status(404).json({ error: 'Pesagem não encontrada para exclusão' });
            }

            await puppy.update({ weight_history: weightHistory });
            res.json(puppy);
        } catch (error) {
            console.error('Erro ao remover pesagem:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async getWeightHistory(req, res) {
        try {
            const { id } = req.params;
            const puppy = await db.Puppy.findByPk(id);

            if (!puppy) {
                return res.status(404).json({ error: 'Filhote não encontrado' });
            }

            res.json(puppy.weight_history || []);
        } catch (error) {
            console.error('Erro ao buscar histórico de pesagem:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async regenerateQRCode(req, res) {
        try {
            const { id } = req.params;
            const puppy = await db.Puppy.findByPk(id);

            if (!puppy) {
                return res.status(404).json({ error: 'Filhote não encontrado' });
            }

            if (!puppy.unique_code) {
                return res.status(400).json({ error: 'Filhote não possui código único' });
            }

            const qrUrl = qrCodeService.generatePuppyProfileURL(puppy.unique_code);
            const qrCodeData = await qrCodeService.generateQRCode(qrUrl);

            await puppy.update({ qr_code_data: qrCodeData });
            res.json({ qr_code_data: qrCodeData });
        } catch (error) {
            console.error('Erro ao gerar QR code:', error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new PuppyController();
