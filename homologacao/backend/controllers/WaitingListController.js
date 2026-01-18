const db = require('../models');

class WaitingListController {
    async create(req, res) {
        try {
            const waitingList = await db.WaitingList.create(req.body);
            res.status(201).json(waitingList);
        } catch (error) {
            console.error('Erro ao criar registro na lista de espera:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async findAll(req, res) {
        try {
            const { status, search } = req.query;

            const where = {};
            if (status) where.status = status;

            // Search by name, city, or email
            if (search) {
                where[db.Sequelize.Op.or] = [
                    { name: { [db.Sequelize.Op.iLike]: `%${search}%` } },
                    { city: { [db.Sequelize.Op.iLike]: `%${search}%` } },
                    { email: { [db.Sequelize.Op.iLike]: `%${search}%` } }
                ];
            }

            const waitingLists = await db.WaitingList.findAll({
                where,
                order: [['createdAt', 'DESC']]
            });

            res.json(waitingLists);
        } catch (error) {
            console.error('Erro ao listar registros da lista de espera:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async findOne(req, res) {
        try {
            const { id } = req.params;
            const waitingList = await db.WaitingList.findByPk(id);

            if (!waitingList) {
                return res.status(404).json({ error: 'Registro não encontrado' });
            }

            res.json(waitingList);
        } catch (error) {
            console.error('Erro ao buscar registro:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const waitingList = await db.WaitingList.findByPk(id);

            if (!waitingList) {
                return res.status(404).json({ error: 'Registro não encontrado' });
            }

            await waitingList.update(req.body);
            res.json(waitingList);
        } catch (error) {
            console.error('Erro ao atualizar registro:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const waitingList = await db.WaitingList.findByPk(id);

            if (!waitingList) {
                return res.status(404).json({ error: 'Registro não encontrado' });
            }

            await waitingList.update({ status });
            res.json(waitingList);
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const waitingList = await db.WaitingList.findByPk(id);

            if (!waitingList) {
                return res.status(404).json({ error: 'Registro não encontrado' });
            }

            await waitingList.destroy();
            res.json({ message: 'Registro deletado com sucesso' });
        } catch (error) {
            console.error('Erro ao deletar registro:', error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new WaitingListController();
