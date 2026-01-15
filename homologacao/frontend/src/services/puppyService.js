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
    }
};

export default puppyService;
