import api from './api';

/**
 * Media Service
 * Handles all API calls related to media files and albums
 */

// Media Files
export const uploadMedia = async (file, metadata = {}) => {
    const formData = new FormData();
    formData.append('file', file);

    if (metadata.description) formData.append('description', metadata.description);
    if (metadata.tags) formData.append('tags', JSON.stringify(metadata.tags));
    if (metadata.album_id) formData.append('album_id', metadata.album_id);

    const response = await api.post('/api/media/upload', formData);
    return response.data;
};

export const uploadMultiple = async (files, metadata = {}) => {
    const formData = new FormData();

    files.forEach(file => {
        formData.append('files', file);
    });

    if (metadata.album_id) formData.append('album_id', metadata.album_id);

    const response = await api.post('/api/media/upload-multiple', formData);
    return response.data;
};

export const getMedia = async (filters = {}) => {
    const response = await api.get('/api/media', { params: filters });
    return response.data;
};

export const getMediaById = async (id) => {
    const response = await api.get(`/api/media/${id}`);
    return response.data;
};

export const updateMedia = async (id, data) => {
    const response = await api.put(`/api/media/${id}`, data);
    return response.data;
};

export const deleteMedia = async (id) => {
    const response = await api.delete(`/api/media/${id}`);
    return response.data;
};

// Albums
export const createAlbum = async (data) => {
    const response = await api.post('/api/media/albums', data);
    return response.data;
};

export const getAlbums = async (filters = {}) => {
    const response = await api.get('/api/media/albums', { params: filters });
    return response.data;
};

export const updateAlbum = async (id, data) => {
    const response = await api.put(`/api/media/albums/${id}`, data);
    return response.data;
};

export const addMediaToAlbum = async (albumId, mediaIds) => {
    const response = await api.post(`/api/media/albums/${albumId}/media`, { mediaIds });
    return response.data;
};

export const deleteAlbum = async (id) => {
    const response = await api.delete(`/api/media/albums/${id}`);
    return response.data;
};

export const removeMediaFromAlbum = async (albumId, mediaId) => {
    const response = await api.delete(`/api/media/albums/${albumId}/media/${mediaId}`);
    return response.data;
};

export const getPublicAlbum = async (token) => {
    const response = await api.get(`/api/public/albums/${token}`);
    return response.data;
};

export const getAlbumById = async (id) => {
    const response = await api.get(`/api/media/albums/${id}/details`);
    return response.data;
};

export const toggleLinkStatus = async (id, is_link_active) => {
    const response = await api.put(`/api/media/albums/${id}/toggle-link`, { is_link_active });
    return response.data;
};

export default {
    uploadMedia,
    uploadMultiple,
    getMedia,
    getMediaById,
    updateMedia,
    deleteMedia,
    createAlbum,
    getAlbums,
    getAlbums,
    updateAlbum,
    addMediaToAlbum,
    removeMediaFromAlbum,
    deleteAlbum,
    getPublicAlbum,
    getAlbumById,
    toggleLinkStatus
};
