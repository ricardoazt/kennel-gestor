const db = require('../models');

/**
 * Bloqueia uma vaga na ninhada decrementando o contador de disponibilidade
 * @param {number} litterId - ID da ninhada
 * @param {string} gender - 'male' ou 'female'
 * @returns {Promise<boolean>} - true se bloqueou com sucesso
 */
async function blockLitterSlot(litterId, gender) {
    const litter = await db.Litter.findByPk(litterId);

    if (!litter) {
        throw new Error('Ninhada não encontrada');
    }

    const field = gender === 'male' ? 'available_males' : 'available_females';

    if (litter[field] <= 0) {
        throw new Error(`Não há mais ${gender === 'male' ? 'machos' : 'fêmeas'} disponíveis nesta ninhada`);
    }

    await litter.decrement(field, { by: 1 });
    return true;
}

/**
 * Libera uma vaga na ninhada incrementando o contador de disponibilidade
 * @param {number} litterId - ID da ninhada
 * @param {string} gender - 'male' ou 'female'
 * @returns {Promise<boolean>} - true se liberou com sucesso
 */
async function releaseLitterSlot(litterId, gender) {
    const litter = await db.Litter.findByPk(litterId);

    if (!litter) {
        throw new Error('Ninhada não encontrada');
    }

    const field = gender === 'male' ? 'available_males' : 'available_females';
    const totalField = gender === 'male' ? 'total_males' : 'total_females';

    // Não permitir liberar mais do que o total
    if (litter[field] >= litter[totalField]) {
        console.warn(`Tentativa de liberar vaga além do total disponível para ninhada ${litterId}`);
        return false;
    }

    await litter.increment(field, { by: 1 });
    return true;
}

/**
 * Verifica se há overbooking em uma ninhada
 * @param {number} litterId - ID da ninhada
 * @returns {Promise<Object>} - { hasOverbooking: boolean, details: {...} }
 */
async function checkOverbooking(litterId) {
    const litter = await db.Litter.findByPk(litterId, {
        include: [
            {
                model: db.Reservation,
                as: 'reservations',
                where: {
                    status: ['confirmed', 'contract_pending', 'active']
                },
                required: false
            }
        ]
    });

    if (!litter) {
        throw new Error('Ninhada não encontrada');
    }

    const totalCapacity = litter.total_males + litter.total_females;
    const confirmedReservations = litter.reservations ? litter.reservations.length : 0;

    // Count by gender
    let maleReservations = 0;
    let femaleReservations = 0;

    if (litter.reservations) {
        litter.reservations.forEach(res => {
            if (res.choice_gender === 'male') maleReservations++;
            if (res.choice_gender === 'female') femaleReservations++;
        });
    }

    const maleOverbooking = maleReservations > litter.total_males;
    const femaleOverbooking = femaleReservations > litter.total_females;
    const totalOverbooking = confirmedReservations > totalCapacity;

    return {
        hasOverbooking: maleOverbooking || femaleOverbooking || totalOverbooking,
        details: {
            total: {
                capacity: totalCapacity,
                reserved: confirmedReservations,
                overbooking: totalOverbooking
            },
            males: {
                capacity: litter.total_males,
                reserved: maleReservations,
                available: litter.available_males,
                overbooking: maleOverbooking
            },
            females: {
                capacity: litter.total_females,
                reserved: femaleReservations,
                available: litter.available_females,
                overbooking: femaleOverbooking
            }
        }
    };
}

/**
 * Calcula data de expiração
 * @param {number} hoursToExpire - Horas até expirar (padrão: 24)
 * @returns {Date}
 */
function calculateExpiryDate(hoursToExpire = 24) {
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + hoursToExpire);
    return expiryDate;
}

/**
 * Retorna reservas urgentes (próximas de expirar)
 * @param {number} hoursThreshold - Threshold em horas (padrão: 6)
 * @returns {Promise<Array>} - Array de reservas
 */
async function getUrgentReservations(hoursThreshold = 6) {
    const thresholdDate = new Date();
    thresholdDate.setHours(thresholdDate.getHours() + hoursThreshold);

    const reservations = await db.Reservation.findAll({
        where: {
            status: 'awaiting_deposit',
            expires_at: {
                [db.Sequelize.Op.lte]: thresholdDate,
                [db.Sequelize.Op.gt]: new Date() // Ainda não expirou
            }
        },
        include: [
            { model: db.Client, as: 'client' },
            { model: db.Litter, as: 'litter' },
            { model: db.Puppy, as: 'puppy' }
        ],
        order: [['expires_at', 'ASC']]
    });

    return reservations;
}

/**
 * Retorna classificação de urgência baseada no tempo restante
 * @param {Date} expiresAt - Data de expiração
 * @returns {string} - 'critical' | 'warning' | 'normal'
 */
function getUrgencyLevel(expiresAt) {
    if (!expiresAt) return 'normal';

    const now = new Date();
    const hoursRemaining = (expiresAt - now) / (1000 * 60 * 60);

    if (hoursRemaining < 0) return 'expired';
    if (hoursRemaining <= 6) return 'critical';
    if (hoursRemaining <= 12) return 'warning';
    return 'normal';
}

module.exports = {
    blockLitterSlot,
    releaseLitterSlot,
    checkOverbooking,
    calculateExpiryDate,
    getUrgentReservations,
    getUrgencyLevel
};
