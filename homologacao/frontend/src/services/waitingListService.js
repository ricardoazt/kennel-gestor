import api from './api';

const API_URL = '/api/waiting-list';

const waitingListService = {
    create: async (data) => {
        const response = await api.post(API_URL, data);
        return response.data;
    },

    getAll: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.search) params.append('search', filters.search);

        const response = await api.get(`${API_URL}?${params.toString()}`);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`${API_URL}/${id}`);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`${API_URL}/${id}`, data);
        return response.data;
    },

    updateStatus: async (id, status) => {
        const response = await api.put(`${API_URL}/${id}/status`, { status });
        return response.data;
    },

    remove: async (id) => {
        const response = await api.delete(`${API_URL}/${id}`);
        return response.data;
    }
};

export default waitingListService;
