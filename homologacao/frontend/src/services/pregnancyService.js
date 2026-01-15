import api from './api';

const pregnancyService = {
    // Get all pregnancies
    async getAll(status = null) {
        try {
            const params = status ? { status } : {};
            const response = await api.get('/api/pregnancies', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching pregnancies:', error);
            throw error;
        }
    },

    // Get single pregnancy
    async getById(id) {
        try {
            const response = await api.get(`/api/pregnancies/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching pregnancy:', error);
            throw error;
        }
    },

    // Create new pregnancy
    async create(data) {
        try {
            const response = await api.post('/api/pregnancies', data);
            return response.data;
        } catch (error) {
            console.error('Error creating pregnancy:', error);
            throw error;
        }
    },

    // Update pregnancy
    async update(id, data) {
        try {
            const response = await api.put(`/api/pregnancies/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating pregnancy:', error);
            throw error;
        }
    },

    // Update pregnancy status
    async updateStatus(id, status, actualBirthDate = null) {
        try {
            const response = await api.put(`/api/pregnancies/${id}/status`, {
                status,
                actual_birth_date: actualBirthDate
            });
            return response.data;
        } catch (error) {
            console.error('Error updating pregnancy status:', error);
            throw error;
        }
    },

    // Delete pregnancy
    async delete(id) {
        try {
            const response = await api.delete(`/api/pregnancies/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting pregnancy:', error);
            throw error;
        }
    },

    // Calculate days pregnant
    calculateDaysPregnant(breedingDate) {
        const today = new Date();
        const breeding = new Date(breedingDate);
        const diffTime = Math.abs(today - breeding);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    },

    // Calculate progress percentage
    calculateProgress(breedingDate) {
        const daysPregnant = this.calculateDaysPregnant(breedingDate);
        const totalDays = 63;
        return Math.min((daysPregnant / totalDays) * 100, 100);
    }
};

export default pregnancyService;
