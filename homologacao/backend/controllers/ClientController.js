const db = require('../models');

class ClientController {
    async create(req, res) {
        try {
            const client = await db.Client.create(req.body);
            res.status(201).json(client);
        } catch (error) {
            console.error('Erro ao criar cliente:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async findAll(req, res) {
        try {
            const { type, status, search } = req.query;

            const where = {};
            if (type) where.type = type;
            if (status) where.status = status;

            // Search by name, email, or phone
            if (search) {
                where[db.Sequelize.Op.or] = [
                    { name: { [db.Sequelize.Op.iLike]: `%${search}%` } },
                    { email: { [db.Sequelize.Op.iLike]: `%${search}%` } },
                    { phone: { [db.Sequelize.Op.iLike]: `%${search}%` } }
                ];
            }

            const clients = await db.Client.findAll({
                where,
                order: [['name', 'ASC']]
            });

            res.json(clients);
        } catch (error) {
            console.error('Erro ao listar clientes:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async findOne(req, res) {
        try {
            const { id } = req.params;
            const client = await db.Client.findByPk(id, {
                include: [
                    {
                        model: db.Reservation,
                        as: 'reservations',
                        include: [
                            { model: db.Litter, as: 'litter' },
                            { model: db.Puppy, as: 'puppy' }
                        ]
                    }
                ]
            });

            if (!client) {
                return res.status(404).json({ error: 'Cliente não encontrado' });
            }

            res.json(client);
        } catch (error) {
            console.error('Erro ao buscar cliente:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const client = await db.Client.findByPk(id);

            if (!client) {
                return res.status(404).json({ error: 'Cliente não encontrado' });
            }

            await client.update(req.body);
            res.json(client);
        } catch (error) {
            console.error('Erro ao atualizar cliente:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const client = await db.Client.findByPk(id);

            if (!client) {
                return res.status(404).json({ error: 'Cliente não encontrado' });
            }

            await client.destroy();
            res.json({ message: 'Cliente deletado com sucesso' });
        } catch (error) {
            console.error('Erro ao deletar cliente:', error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ClientController();
