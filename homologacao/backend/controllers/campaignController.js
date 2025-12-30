const { Campaign, CampaignTemplate, MediaFile, CampaignMedia, Animal, User } = require('../models');
const { generateUniqueSlug } = require('../utils/slugGenerator');
const { Op } = require('sequelize');

/**
 * Create a new campaign
 */
const createCampaign = async (req, res) => {
    try {
        const { title, campaign_type, template_id, content, settings, related_dog_id, related_litter_id } = req.body;

        if (!title || !campaign_type) {
            return res.status(400).json({ error: 'Title and campaign type are required' });
        }

        // Generate unique slug
        const slug = await generateUniqueSlug(title, async (slug) => {
            const existing = await Campaign.findOne({ where: { slug } });
            return !!existing;
        });

        // Get template default content if template_id provided
        let campaignContent = content || { modules: [] };
        if (template_id && !content) {
            const template = await CampaignTemplate.findByPk(template_id);
            if (template) {
                campaignContent = template.default_content;
            }
        }

        const campaign = await Campaign.create({
            title,
            slug,
            campaign_type,
            template_id,
            content: campaignContent,
            settings: settings || {},
            seo_title: title,
            seo_description: null,
            related_dog_id,
            related_litter_id,
            status: 'draft',
            created_by: req.user?.id || null
        });

        res.status(201).json({
            message: 'Campaign created successfully',
            campaign
        });
    } catch (error) {
        console.error('Create campaign error:', error);
        res.status(500).json({ error: 'Failed to create campaign', details: error.message });
    }
};

/**
 * Get all campaigns with filters
 */
const getCampaigns = async (req, res) => {
    try {
        const { status, campaign_type, search, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        const where = {};
        if (status) where.status = status;
        if (campaign_type) where.campaign_type = campaign_type;
        if (search) {
            where[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                { seo_description: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const { count, rows } = await Campaign.findAndCountAll({
            where,
            include: [
                { model: CampaignTemplate, as: 'template' },
                { model: Animal, as: 'relatedDog' },
                { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
                { model: MediaFile, as: 'mediaFiles', through: { attributes: ['display_order', 'module_id'] } }
            ],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            campaigns: rows,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        console.error('Get campaigns error:', error);
        res.status(500).json({ error: 'Failed to fetch campaigns', details: error.message });
    }
};

/**
 * Get single campaign by ID
 */
const getCampaignById = async (req, res) => {
    try {
        const { id } = req.params;

        const campaign = await Campaign.findByPk(id, {
            include: [
                { model: CampaignTemplate, as: 'template' },
                { model: Animal, as: 'relatedDog' },
                { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
                {
                    model: MediaFile,
                    as: 'mediaFiles',
                    through: { attributes: ['display_order', 'module_id'] },
                    order: [[{ model: CampaignMedia }, 'display_order', 'ASC']]
                }
            ]
        });

        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }

        res.json(campaign);
    } catch (error) {
        console.error('Get campaign by ID error:', error);
        res.status(500).json({ error: 'Failed to fetch campaign', details: error.message });
    }
};

/**
 * Update campaign
 */
const updateCampaign = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, settings, seo_title, seo_description, related_dog_id, media_files } = req.body;

        const campaign = await Campaign.findByPk(id);
        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }

        // Update basic fields
        await campaign.update({
            title: title !== undefined ? title : campaign.title,
            content: content !== undefined ? content : campaign.content,
            settings: settings !== undefined ? settings : campaign.settings,
            seo_title: seo_title !== undefined ? seo_title : campaign.seo_title,
            seo_description: seo_description !== undefined ? seo_description : campaign.seo_description,
            related_dog_id: related_dog_id !== undefined ? related_dog_id : campaign.related_dog_id
        });

        // Update media files if provided
        if (media_files && Array.isArray(media_files)) {
            // Remove existing associations
            await CampaignMedia.destroy({ where: { campaign_id: id } });

            // Add new associations
            for (const mediaItem of media_files) {
                await CampaignMedia.create({
                    campaign_id: id,
                    media_file_id: mediaItem.media_file_id,
                    display_order: mediaItem.display_order || 0,
                    module_id: mediaItem.module_id || null
                });
            }
        }

        // Reload with associations
        const updatedCampaign = await Campaign.findByPk(id, {
            include: [
                { model: CampaignTemplate, as: 'template' },
                { model: Animal, as: 'relatedDog' },
                { model: MediaFile, as: 'mediaFiles', through: { attributes: ['display_order', 'module_id'] } }
            ]
        });

        res.json({
            message: 'Campaign updated successfully',
            campaign: updatedCampaign
        });
    } catch (error) {
        console.error('Update campaign error:', error);
        res.status(500).json({ error: 'Failed to update campaign', details: error.message });
    }
};

/**
 * Delete campaign
 */
const deleteCampaign = async (req, res) => {
    try {
        const { id } = req.params;

        const campaign = await Campaign.findByPk(id);
        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }

        await campaign.destroy();

        res.json({ message: 'Campaign deleted successfully' });
    } catch (error) {
        console.error('Delete campaign error:', error);
        res.status(500).json({ error: 'Failed to delete campaign', details: error.message });
    }
};

/**
 * Publish campaign
 */
const publishCampaign = async (req, res) => {
    try {
        const { id } = req.params;

        const campaign = await Campaign.findByPk(id);
        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }

        await campaign.update({
            status: 'published',
            published_at: new Date()
        });

        res.json({
            message: 'Campaign published successfully',
            campaign
        });
    } catch (error) {
        console.error('Publish campaign error:', error);
        res.status(500).json({ error: 'Failed to publish campaign', details: error.message });
    }
};

/**
 * Get all templates
 */
const getTemplates = async (req, res) => {
    try {
        const { template_type } = req.query;

        const where = { is_active: true };
        if (template_type) where.template_type = template_type;

        const templates = await CampaignTemplate.findAll({
            where,
            order: [['name', 'ASC']]
        });

        res.json(templates);
    } catch (error) {
        console.error('Get templates error:', error);
        res.status(500).json({ error: 'Failed to fetch templates', details: error.message });
    }
};

/**
 * Generate share links for campaign
 */
const generateShareLinks = async (req, res) => {
    try {
        const { id } = req.params;

        const campaign = await Campaign.findByPk(id);
        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }

        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        const publicUrl = `${baseUrl}/p/${campaign.slug}`;

        // Generate share links
        const shareLinks = {
            public_url: publicUrl,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(`Confira: ${campaign.title} - ${publicUrl}`)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicUrl)}`,
            twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(publicUrl)}&text=${encodeURIComponent(campaign.title)}`,
            instagram_caption: `${campaign.title}\n\n${campaign.seo_description || ''}\n\nSaiba mais: ${publicUrl}\n\n#canil #dogs #puppies`,
            qr_code: `${baseUrl}/api/campaigns/${id}/qr-code` // Future implementation
        };

        // Increment shares count
        await campaign.increment('shares_count');

        res.json(shareLinks);
    } catch (error) {
        console.error('Generate share links error:', error);
        res.status(500).json({ error: 'Failed to generate share links', details: error.message });
    }
};

/**
 * Get public campaign by slug (no authentication required)
 */
const getPublicCampaign = async (req, res) => {
    try {
        const { slug } = req.params;

        const campaign = await Campaign.findOne({
            where: { slug, status: 'published' },
            include: [
                { model: CampaignTemplate, as: 'template' },
                { model: Animal, as: 'relatedDog' },
                {
                    model: MediaFile,
                    as: 'mediaFiles',
                    through: { attributes: ['display_order', 'module_id'] }
                }
            ]
        });

        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found or not published' });
        }

        // Increment views count
        await campaign.increment('views_count');

        res.json(campaign);
    } catch (error) {
        console.error('Get public campaign error:', error);
        res.status(500).json({ error: 'Failed to fetch campaign', details: error.message });
    }
};

/**
 * Track campaign view
 */
const trackView = async (req, res) => {
    try {
        const { id } = req.params;

        const campaign = await Campaign.findByPk(id);
        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }

        await campaign.increment('views_count');

        res.json({ message: 'View tracked' });
    } catch (error) {
        console.error('Track view error:', error);
        res.status(500).json({ error: 'Failed to track view', details: error.message });
    }
};

module.exports = {
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
