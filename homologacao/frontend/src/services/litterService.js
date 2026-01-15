import api from './api';

const litterService = {
    // Get all litters
    async getAll() {
        try {
            const response = await api.get('/api/litters');
            return response.data;
        } catch (error) {
            console.error('Error fetching litters:', error);
            throw error;
        }
    },

    // Get single litter
    async getById(id) {
        try {
            const response = await api.get(`/api/litters/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching litter:', error);
            throw error;
        }
    },

    // Create new litter
    async create(data) {
        try {
            const response = await api.post('/api/litters', data);
            return response.data;
        } catch (error) {
            console.error('Error creating litter:', error);
            throw error;
        }
    },

    // Update litter
    async update(id, data) {
        try {
            const response = await api.put(`/api/litters/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating litter:', error);
            throw error;
        }
    },

    // Delete litter
    async delete(id) {
        try {
            const response = await api.delete(`/api/litters/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting litter:', error);
            throw error;
        }
    },

    // Calculate puppy age in days
    calculatePuppyAge(birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        const diffTime = Math.abs(today - birth);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }
};

export default litterService;
