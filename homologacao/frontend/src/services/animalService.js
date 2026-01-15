import api from './api';

const animalService = {
    async getAll() {
        try {
            const response = await api.get('/animals');
            return response.data;
        } catch (error) {
            console.error('Error fetching animals:', error);
            throw error;
        }
    },

    async getActive() {
        try {
            const animals = await this.getAll();
            // Filter active animals (you may want to add an 'active' field to the model later)
            return animals;
        } catch (error) {
            console.error('Error fetching active animals:', error);
            throw error;
        }
    },

    async getById(id) {
        try {
            const response = await api.get(`/animals/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching animal:', error);
            throw error;
        }
    }
};

export default animalService;
