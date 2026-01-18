import api from './api';

const puppyService = {
    // Get all puppies for a litter
    async getByLitter(litterId) {
        try {
            const response = await api.get(`/api/puppies?litter_id=${litterId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching puppies:', error);
            throw error;
        }
    },

    // Get single puppy
    async getById(id) {
        try {
            const response = await api.get(`/api/puppies/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching puppy:', error);
            throw error;
        }
    },

    // Get puppy by unique code
    async getByCode(code) {
        try {
            const response = await api.get(`/api/puppies/code/${code}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching puppy by code:', error);
            throw error;
        }
    },

    // Create new puppy
    async create(data) {
        try {
            const response = await api.post('/api/puppies', data);
            return response.data;
        } catch (error) {
            console.error('Error creating puppy:', error);
            throw error;
        }
    },

    // Update puppy
    async update(id, data) {
        try {
            const response = await api.put(`/api/puppies/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating puppy:', error);
            throw error;
        }
    },

    // Delete puppy
    async delete(id) {
        try {
            const response = await api.delete(`/api/puppies/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting puppy:', error);
            throw error;
        }
    },

    // Add weight entry
    async addWeightEntry(id, weight, date) {
        try {
            const response = await api.post(`/api/puppies/${id}/weight`, { weight, date });
            return response.data;
        } catch (error) {
            console.error('Error adding weight entry:', error);
            throw error;
        }
    },

    // Get weight history
    async getWeightHistory(id) {
        try {
            const response = await api.get(`/api/puppies/${id}/weight-history`);
            return response.data;
        } catch (error) {
            console.error('Error fetching weight history:', error);
            throw error;
        }
    },

    // Regenerate QR code
    async regenerateQRCode(id) {
        try {
            const response = await api.post(`/api/puppies/${id}/qrcode`);
            return response.data;
        } catch (error) {
            console.error('Error regenerating QR code:', error);
            throw error;
        }
    }
};

export default puppyService;
