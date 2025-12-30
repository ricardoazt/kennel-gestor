import api from './api';

/**
 * Campaign Service
 * Handles all API calls related to campaigns and templates
 */

// Campaigns
export const createCampaign = async (data) => {
    const response = await api.post('/api/campaigns', data);
    return response.data;
};

export const getCampaigns = async (filters = {}) => {
    const response = await api.get('/api/campaigns', { params: filters });
    return response.data;
};

export const getCampaignById = async (id) => {
    const response = await api.get(`/api/campaigns/${id}`);
    return response.data;
};

export const updateCampaign = async (id, data) => {
    const response = await api.put(`/api/campaigns/${id}`, data);
    return response.data;
};

export const deleteCampaign = async (id) => {
    const response = await api.delete(`/api/campaigns/${id}`);
    return response.data;
};

export const publishCampaign = async (id) => {
    const response = await api.post(`/api/campaigns/${id}/publish`);
    return response.data;
};

// Templates
export const getTemplates = async (templateType = null) => {
    const params = templateType ? { template_type: templateType } : {};
    const response = await api.get('/api/campaigns/templates', { params });
    return response.data;
};

// Share Links
export const generateShareLinks = async (id) => {
    const response = await api.post(`/api/campaigns/${id}/share-links`);
    return response.data;
};

// Public Campaign (no auth required)
export const getPublicCampaign = async (slug) => {
    const response = await api.get(`/p/${slug}`);
    return response.data;
};

// Analytics
export const trackView = async (id) => {
    const response = await api.post(`/api/campaigns/${id}/track-view`);
    return response.data;
};

export default {
    createCampaign,
    getCampaigns,
    getCampaignById,
    updateCampaign,
    deleteCampaign,
    publishCampaign,
    getTemplates,
    generateShareLinks,
    getPublicCampaign,
    trackView
};
