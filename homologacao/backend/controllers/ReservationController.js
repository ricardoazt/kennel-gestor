const db = require('../models');
const {
    blockLitterSlot,
    releaseLitterSlot,
    checkOverbooking,
    calculateExpiryDate
} = require('../utils/reservationAutomation');

class ReservationController {
    // Criar nova reserva
    async create(req, res) {
        try {
            const {
                client_id,
                reservation_type,
                litter_id,
                puppy_id,
                choice_priority,
                choice_gender,
                total_value,
                deposit_value,
                deposit_paid,
                deposit_paid_date,
                payment_method,
                payment_proof_url,
                status,
                notes,
                preferences
            } = req.body;

            // Validações básicas
            if (!client_id || !deposit_value) {
                return res.status(400).json({
                    error: 'Client ID e valor do sinal são obrigatórios'
                });
            }

            if (reservation_type === 'litter_choice' && !litter_id) {
                return res.status(400).json({
                    error: 'Ninhada é obrigatória para reserva por direito de escolha'
                });
            }

            if (reservation_type === 'specific_puppy' && !puppy_id) {
                return res.status(400).json({
                    error: 'Filhote específico é obrigatório para este tipo de reserva'
                });
            }

            // Criar a reserva
            const reservation = await db.Reservation.create({
                client_id,
                reservation_type,
                litter_id,
                puppy_id,
                choice_priority,
                choice_gender,
                total_value,
                deposit_value,
                deposit_paid: deposit_paid || false,
                deposit_paid_date,
                payment_method,
                payment_proof_url,
                status: status || 'awaiting_deposit',
                notes
            });

            // Se houver preferências, criar registro de preferências
            if (preferences && reservation_type === 'litter_choice') {
                await db.ReservationPreferences.create({
                    reservation_id: reservation.id,
                    ...preferences
                });
            }

            // Se status é 'confirmed', bloquear vaga
            if (reservation.status === 'confirmed' && litter_id && choice_gender) {
                try {
                    await blockLitterSlot(litter_id, choice_gender);
                } catch (error) {
                    // Rollback da reserva se não conseguir bloquear
                    await reservation.destroy();
                    return res.status(400).json({
                        error: error.message
                    });
                }
            }

            // Buscar reserva completa com relacionamentos
            const fullReservation = await db.Reservation.findByPk(reservation.id, {
                include: [
                    { model: db.Client, as: 'client' },
                    { model: db.Litter, as: 'litter' },
                    { model: db.Puppy, as: 'puppy' },
                    { model: db.ReservationPreferences, as: 'preferences' }
                ]
            });

            res.status(201).json(fullReservation);
        } catch (error) {
            console.error('Erro ao criar reserva:', error);
            res.status(500).json({ error: error.message });
        }
    }

    // Listar todas as reservas com filtros
    async findAll(req, res) {
        try {
            const { status, litter_id, client_id, reservation_type } = req.query;

            const where = {};
            if (status) where.status = status;
            if (litter_id) where.litter_id = litter_id;
            if (client_id) where.client_id = client_id;
            if (reservation_type) where.reservation_type = reservation_type;

            const reservations = await db.Reservation.findAll({
                where,
                include: [
                    { model: db.Client, as: 'client' },
                    { model: db.Litter, as: 'litter' },
                    { model: db.Puppy, as: 'puppy' },
                    { model: db.ReservationPreferences, as: 'preferences' }
                ],
                order: [
                    ['status', 'ASC'],
                    ['expires_at', 'ASC'],
                    ['createdAt', 'DESC']
                ]
            });

            res.json(reservations);
        } catch (error) {
            console.error('Erro ao listar reservas:', error);
            res.status(500).json({ error: error.message });
        }
    }

    // Buscar reserva por ID
    async findOne(req, res) {
        try {
            const { id } = req.params;

            const reservation = await db.Reservation.findByPk(id, {
                include: [
                    { model: db.Client, as: 'client' },
                    { model: db.Litter, as: 'litter' },
                    { model: db.Puppy, as: 'puppy' },
                    { model: db.ReservationPreferences, as: 'preferences' },
                    { model: db.ReservationDocument, as: 'documents' }
                ]
            });

            if (!reservation) {
                return res.status(404).json({ error: 'Reserva não encontrada' });
            }

            res.json(reservation);
        } catch (error) {
            console.error('Erro ao buscar reserva:', error);
            res.status(500).json({ error: error.message });
        }
    }

    // Atualizar reserva
    async update(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;

            const reservation = await db.Reservation.findByPk(id);

            if (!reservation) {
                return res.status(404).json({ error: 'Reserva não encontrada' });
            }

            // Não permitir atualizar status por este endpoint
            delete updates.status;
            delete updates.status_history;

            await reservation.update(updates);

            // Se houver atualizações de preferências
            if (updates.preferences) {
                await db.ReservationPreferences.upsert({
                    reservation_id: id,
                    ...updates.preferences
                });
            }

            const updatedReservation = await db.Reservation.findByPk(id, {
                include: [
                    { model: db.Client, as: 'client' },
                    { model: db.Litter, as: 'litter' },
                    { model: db.Puppy, as: 'puppy' },
                    { model: db.ReservationPreferences, as: 'preferences' }
                ]
            });

            res.json(updatedReservation);
        } catch (error) {
            console.error('Erro ao atualizar reserva:', error);
            res.status(500).json({ error: error.message });
        }
    }

    // Atualizar status da reserva (workflow crítico)
    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status, notes } = req.body;

            const reservation = await db.Reservation.findByPk(id);

            if (!reservation) {
                return res.status(404).json({ error: 'Reserva não encontrada' });
            }

            const oldStatus = reservation.status;

            // Lógica de bloqueio/liberação de vagas
            if (status === 'confirmed' && oldStatus !== 'confirmed') {
                // Bloqueando vaga ao confirmar
                if (reservation.litter_id && reservation.choice_gender) {
                    try {
                        await blockLitterSlot(reservation.litter_id, reservation.choice_gender);
                    } catch (error) {
                        return res.status(400).json({ error: error.message });
                    }
                }
            }

            if ((status === 'cancelled' || status === 'expired') && oldStatus === 'confirmed') {
                // Liberando vaga ao cancelar/expirar reserva confirmada
                if (reservation.litter_id && reservation.choice_gender) {
                    await releaseLitterSlot(reservation.litter_id, reservation.choice_gender);
                }
            }

            // Atualizar histórico de status
            const statusHistory = reservation.status_history || [];
            statusHistory.push({
                from: oldStatus,
                to: status,
                changed_at: new Date(),
                notes: notes || `Status alterado de ${oldStatus} para ${status}`
            });

            await reservation.update({
                status,
                status_history: statusHistory
            });

            const updatedReservation = await db.Reservation.findByPk(id, {
                include: [
                    { model: db.Client, as: 'client' },
                    { model: db.Litter, as: 'litter' },
                    { model: db.Puppy, as: 'puppy' },
                    { model: db.ReservationPreferences, as: 'preferences' }
                ]
            });

            res.json(updatedReservation);
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            res.status(500).json({ error: error.message });
        }
    }

    // Verificar disponibilidade de ninhada
    async checkAvailability(req, res) {
        try {
            const { litterId } = req.params;

            const overbookingCheck = await checkOverbooking(parseInt(litterId));

            const litter = await db.Litter.findByPk(litterId, {
                include: [
                    {
                        model: db.Reservation,
                        as: 'reservations',
                        where: {
                            status: ['confirmed', 'contract_pending', 'active']
                        },
                        required: false,
                        include: [{ model: db.Client, as: 'client' }]
                    }
                ]
            });

            res.json({
                litter: {
                    id: litter.id,
                    name: litter.name,
                    total_males: litter.total_males,
                    total_females: litter.total_females,
                    available_males: litter.available_males,
                    available_females: litter.available_females
                },
                overbooking: overbookingCheck,
                confirmed_reservations: litter.reservations || []
            });
        } catch (error) {
            console.error('Erro ao verificar disponibilidade:', error);
            res.status(500).json({ error: error.message });
        }
    }

    // Listar reservas de uma ninhada específica
    async getByLitter(req, res) {
        try {
            const { litterId } = req.params;

            const reservations = await db.Reservation.findAll({
                where: { litter_id: litterId },
                include: [
                    { model: db.Client, as: 'client' },
                    { model: db.ReservationPreferences, as: 'preferences' }
                ],
                order: [['status', 'ASC'], ['createdAt', 'DESC']]
            });

            res.json(reservations);
        } catch (error) {
            console.error('Erro ao buscar reservas da ninhada:', error);
            res.status(500).json({ error: error.message });
        }
    }

    // Listar reservas próximas de expirar
    async getExpiring(req, res) {
        try {
            const { hours } = req.query;
            const hoursThreshold = hours ? parseInt(hours) : 6;

            const thresholdDate = new Date();
            thresholdDate.setHours(thresholdDate.getHours() + hoursThreshold);

            const reservations = await db.Reservation.findAll({
                where: {
                    status: 'awaiting_deposit',
                    expires_at: {
                        [db.Sequelize.Op.lte]: thresholdDate,
                        [db.Sequelize.Op.gt]: new Date()
                    }
                },
                include: [
                    { model: db.Client, as: 'client' },
                    { model: db.Litter, as: 'litter' },
                    { model: db.Puppy, as: 'puppy' }
                ],
                order: [['expires_at', 'ASC']]
            });

            res.json(reservations);
        } catch (error) {
            console.error('Erro ao buscar reservas expirando:', error);
            res.status(500).json({ error: error.message });
        }
    }

    // Job automático para cancelar reservas expiradas
    async cancelExpired(req, res) {
        try {
            const expiredReservations = await db.Reservation.findAll({
                where: {
                    status: 'awaiting_deposit',
                    expires_at: {
                        [db.Sequelize.Op.lt]: new Date()
                    }
                }
            });

            const results = [];

            for (const reservation of expiredReservations) {
                const statusHistory = reservation.status_history || [];
                statusHistory.push({
                    from: 'awaiting_deposit',
                    to: 'expired',
                    changed_at: new Date(),
                    notes: 'Reserva expirada automaticamente'
                });

                await reservation.update({
                    status: 'expired',
                    status_history: statusHistory
                });

                results.push({
                    id: reservation.id,
                    client_id: reservation.client_id,
                    expired: true
                });
            }

            res.json({
                message: `${results.length} reservas expiradas foram canceladas`,
                results
            });
        } catch (error) {
            console.error('Erro ao cancelar reservas expiradas:', error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ReservationController();
