const { AgendaEvent, Animal } = require('../models');

module.exports = {
    async create(req, res) {
        try {
            const { animal_id, data, tipo, titulo, descricao, local, participantes, status } = req.body;

            const animal = await Animal.findByPk(animal_id);
            if (!animal) return res.status(404).json({ error: 'Animal not found' });

            const event = await AgendaEvent.create({
                animal_id,
                data,
                tipo,
                titulo,
                descricao,
                local,
                participantes,
                status
            });

            return res.status(201).json(event);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },

    async findByAnimal(req, res) {
        try {
            const { animal_id } = req.params;
            const events = await AgendaEvent.findAll({
                where: { animal_id },
                order: [['data', 'ASC']]
            });
            return res.json(events);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const event = await AgendaEvent.findByPk(req.params.id);
            if (!event) return res.status(404).json({ error: 'Event not found' });

            await event.update(req.body);
            return res.json(event);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },

    async delete(req, res) {
        try {
            const event = await AgendaEvent.findByPk(req.params.id);
            if (!event) return res.status(404).json({ error: 'Event not found' });

            await event.destroy();
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
};
