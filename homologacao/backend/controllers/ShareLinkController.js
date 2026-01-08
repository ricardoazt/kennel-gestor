const { ShareLink, MediaAlbum, MediaFile, User } = require('../models');
const { Op } = require('sequelize');

/**
 * Create a new share link for an album
 */
const createShareLink = async (req, res) => {
    try {
        const { albumId } = req.params;
        const { name, description, expires_at } = req.body;

        // Verify album exists
        const album = await MediaAlbum.findByPk(albumId);
        if (!album) {
            return res.status(404).json({ error: 'Album not found' });
        }

        // Create share link
        const shareLink = await ShareLink.create({
            album_id: albumId,
            name: name || `Link criado em ${new Date().toLocaleString('pt-BR')}`,
            description,
            expires_at: expires_at || null
        });

        // Generate full URL
        const fullUrl = `${req.protocol}://${req.get('host')}/album/${shareLink.token}`;

        res.status(201).json({
            message: 'Share link created successfully',
            link: shareLink,
            url: fullUrl
        });
    } catch (error) {
        console.error('Create share link error:', error);
        res.status(500).json({ error: 'Failed to create share link', details: error.message });
    }
};

/**
 * Get all share links for an album
 */
const getShareLinks = async (req, res) => {
    try {
        const { albumId } = req.params;

        // Verify album exists
        const album = await MediaAlbum.findByPk(albumId);
        if (!album) {
            return res.status(404).json({ error: 'Album not found' });
        }

        // Get all share links
        const shareLinks = await ShareLink.findAll({
            where: { album_id: albumId },
            order: [['createdAt', 'DESC']]
        });

        // Add computed properties
        const linksWithStatus = shareLinks.map(link => ({
            ...link.toJSON(),
            is_expired: link.isExpired(),
            is_valid: link.isValid(),
            url: `${req.protocol}://${req.get('host')}/album/${link.token}`
        }));

        res.json({ links: linksWithStatus });
    } catch (error) {
        console.error('Get share links error:', error);
        res.status(500).json({ error: 'Failed to get share links', details: error.message });
    }
};

/**
 * Toggle share link active status
 */
const toggleShareLink = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;

        const shareLink = await ShareLink.findByPk(id);
        if (!shareLink) {
            return res.status(404).json({ error: 'Share link not found' });
        }

        await shareLink.update({ is_active });

        res.json({
            message: `Share link ${is_active ? 'activated' : 'deactivated'} successfully`,
            link: shareLink
        });
    } catch (error) {
        console.error('Toggle share link error:', error);
        res.status(500).json({ error: 'Failed to toggle share link', details: error.message });
    }
};

/**
 * Delete a share link
 */
const deleteShareLink = async (req, res) => {
    try {
        const { id } = req.params;

        const shareLink = await ShareLink.findByPk(id);
        if (!shareLink) {
            return res.status(404).json({ error: 'Share link not found' });
        }

        await shareLink.destroy();

        res.json({ message: 'Share link deleted successfully' });
    } catch (error) {
        console.error('Delete share link error:', error);
        res.status(500).json({ error: 'Failed to delete share link', details: error.message });
    }
};

/**
 * Get public album by share link token (with validation)
 */
const getPublicAlbumByToken = async (req, res) => {
    try {
        const { token } = req.params;

        // Find share link
        const shareLink = await ShareLink.findOne({
            where: { token },
            include: [{
                model: MediaAlbum,
                as: 'album',
                include: [
                    { model: MediaFile, as: 'coverImage' },
                    { model: MediaFile, as: 'mediaFiles' },
                    { model: User, as: 'creator', attributes: ['name'] }
                ]
            }]
        });

        if (!shareLink) {
            return res.status(404).json({ error: 'Link de compartilhamento não encontrado' });
        }

        // Check if link is active
        if (!shareLink.is_active) {
            return res.status(403).json({ error: 'Este link foi revogado e não está mais ativo' });
        }

        // Check if link is expired
        if (shareLink.isExpired()) {
            return res.status(403).json({ error: 'Este link expirou e não está mais disponível' });
        }

        // Increment access count
        await shareLink.increment('access_count');

        // Return album data
        res.json(shareLink.album);
    } catch (error) {
        console.error('Get public album by token error:', error);
        res.status(500).json({ error: 'Failed to fetch album', details: error.message });
    }
};

module.exports = {
    createShareLink,
    getShareLinks,
    toggleShareLink,
    deleteShareLink,
    getPublicAlbumByToken
};
