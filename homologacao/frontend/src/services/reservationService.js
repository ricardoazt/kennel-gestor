import api from './api';

/**
 * Reservation Service
 * Handles all API calls related to reservations, litters, puppies, and clients
 */

// ===== RESERVATIONS =====
export const createReservation = async (data) => {
    const response = await api.post('/api/reservations', data);
    return response.data;
};

export const getReservations = async (filters = {}) => {
    const response = await api.get('/api/reservations', { params: filters });
    return response.data;
};

export const getReservationById = async (id) => {
    const response = await api.get(`/api/reservations/${id}`);
    return response.data;
};

export const updateReservation = async (id, data) => {
    const response = await api.put(`/api/reservations/${id}`, data);
    return response.data;
};

export const updateReservationStatus = async (id, status, notes = '') => {
    const response = await api.put(`/api/reservations/${id}/status`, { status, notes });
    return response.data;
};

export const getReservationsByLitter = async (litterId) => {
    const response = await api.get(`/api/reservations/litter/${litterId}`);
    return response.data;
};

export const getExpiringReservations = async (hours = 6) => {
    const response = await api.get('/api/reservations/expiring', { params: { hours } });
    return response.data;
};

export const cancelExpiredReservations = async () => {
    const response = await api.post('/api/reservations/cancel-expired');
    return response.data;
};

// ===== LITTERS =====
export const createLitter = async (data) => {
    const response = await api.post('/api/litters', data);
    return response.data;
};

export const getLitters = async () => {
    const response = await api.get('/api/litters');
    return response.data;
};

export const getLitterById = async (id) => {
    const response = await api.get(`/api/litters/${id}`);
    return response.data;
};

export const updateLitter = async (id, data) => {
    const response = await api.put(`/api/litters/${id}`, data);
    return response.data;
};

export const deleteLitter = async (id) => {
    const response = await api.delete(`/api/litters/${id}`);
    return response.data;
};

export const checkLitterAvailability = async (litterId) => {
    const response = await api.get(`/api/litters/${litterId}/availability`);
    return response.data;
};

// ===== PUPPIES =====
export const createPuppy = async (data) => {
    const response = await api.post('/api/puppies', data);
    return response.data;
};

export const getPuppies = async (filters = {}) => {
    const response = await api.get('/api/puppies', { params: filters });
    return response.data;
};

export const getPuppyById = async (id) => {
    const response = await api.get(`/api/puppies/${id}`);
    return response.data;
};

export const updatePuppy = async (id, data) => {
    const response = await api.put(`/api/puppies/${id}`, data);
    return response.data;
};

export const deletePuppy = async (id) => {
    const response = await api.delete(`/api/puppies/${id}`);
    return response.data;
};

// ===== CLIENTS =====
export const createClient = async (data) => {
    const response = await api.post('/api/clients', data);
    return response.data;
};

export const getClients = async (filters = {}) => {
    const response = await api.get('/api/clients', { params: filters });
    return response.data;
};

export const getClientById = async (id) => {
    const response = await api.get(`/api/clients/${id}`);
    return response.data;
};

export const updateClient = async (id, data) => {
    const response = await api.put(`/api/clients/${id}`, data);
    return response.data;
};

export const deleteClient = async (id) => {
    const response = await api.delete(`/api/clients/${id}`);
    return response.data;
};

export default {
    // Reservations
    createReservation,
    getReservations,
    getReservationById,
    updateReservation,
    updateReservationStatus,
    getReservationsByLitter,
    getExpiringReservations,
    cancelExpiredReservations,
    // Litters
    createLitter,
    getLitters,
    getLitterById,
    updateLitter,
    deleteLitter,
    checkLitterAvailability,
    // Puppies
    createPuppy,
    getPuppies,
    getPuppyById,
    updatePuppy,
    deletePuppy,
    // Clients
    createClient,
    getClients,
    getClientById,
    updateClient,
    deleteClient
};
