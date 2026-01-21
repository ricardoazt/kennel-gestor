import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const testService = {
    // Get all available test templates
    getTemplates: async () => {
        const response = await axios.get(`${API_URL}/api/tests/templates`);
        return response.data;
    },

    // Get details of a specific template
    getTemplateById: async (id) => {
        const response = await axios.get(`${API_URL}/api/tests/templates/${id}`);
        return response.data;
    },

    // Save a test result
    saveResult: async (resultData) => {
        const response = await axios.post(`${API_URL}/api/tests/results`, resultData);
        return response.data;
    },

    // Get all results for a puppy
    getResultsByPuppy: async (puppyId) => {
        const response = await axios.get(`${API_URL}/api/tests/results/puppy/${puppyId}`);
        return response.data;
    }
};

export default testService;
