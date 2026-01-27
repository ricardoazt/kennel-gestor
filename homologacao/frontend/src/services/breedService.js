import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class BreedService {
    /**
     * Get all breeds
     * @param {boolean} activeOnly - If true, returns only active breeds
     * @returns {Promise<Array>}
     */
    async getAll(activeOnly = false) {
        try {
            const params = activeOnly ? { active: 'true' } : {};
            const response = await axios.get(`${API_URL}/api/breeds`, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching breeds:', error);
            throw error;
        }
    }

    /**
     * Get single breed by ID
     * @param {number} id - Breed ID
     * @returns {Promise<Object>}
     */
    async getById(id) {
        try {
            const response = await axios.get(`${API_URL}/api/breeds/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching breed:', error);
            throw error;
        }
    }

    /**
     * Create new breed
     * @param {Object} breedData - { name, description, active }
     * @returns {Promise<Object>}
     */
    async create(breedData) {
        try {
            const response = await axios.post(`${API_URL}/api/breeds`, breedData);
            return response.data;
        } catch (error) {
            console.error('Error creating breed:', error);
            throw error;
        }
    }

    /**
     * Update breed
     * @param {number} id - Breed ID
     * @param {Object} breedData - { name, description, active }
     * @returns {Promise<Object>}
     */
    async update(id, breedData) {
        try {
            const response = await axios.put(`${API_URL}/api/breeds/${id}`, breedData);
            return response.data;
        } catch (error) {
            console.error('Error updating breed:', error);
            throw error;
        }
    }

    /**
     * Toggle active status
     * @param {number} id - Breed ID
     * @returns {Promise<Object>}
     */
    async toggleActive(id) {
        try {
            const response = await axios.patch(`${API_URL}/api/breeds/${id}/toggle`);
            return response.data;
        } catch (error) {
            console.error('Error toggling breed status:', error);
            throw error;
        }
    }

    /**
     * Delete breed
     * @param {number} id - Breed ID
     * @returns {Promise<Object>}
     */
    async delete(id) {
        try {
            const response = await axios.delete(`${API_URL}/api/breeds/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting breed:', error);
            throw error;
        }
    }
}

export default new BreedService();
