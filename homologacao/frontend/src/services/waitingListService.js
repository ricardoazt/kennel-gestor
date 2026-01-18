import axios from 'axios';

const API_URL = 'http://localhost:3000/api/waiting-list';

const waitingListService = {
    create: async (data) => {
        const response = await axios.post(API_URL, data);
        return response.data;
    },

    getAll: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.search) params.append('search', filters.search);

        const response = await axios.get(`${API_URL}?${params.toString()}`);
        return response.data;
    },

    getById: async (id) => {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    },

    update: async (id, data) => {
        const response = await axios.put(`${API_URL}/${id}`, data);
        return response.data;
    },

    updateStatus: async (id, status) => {
        const response = await axios.put(`${API_URL}/${id}/status`, { status });
        return response.data;
    },

    remove: async (id) => {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    }
};

export default waitingListService;
