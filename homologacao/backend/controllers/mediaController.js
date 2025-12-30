const { MediaFile, MediaAlbum, User } = require('../models');
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { generateThumbnail, getImageMetadata, optimizeImage } = require('../utils/imageProcessor');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads/media');
        if (!require('fs').existsSync(uploadDir)) {
            require('fs').mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `media-${uniqueSuffix}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    // Accept images and videos
    const allowedMimes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
        'video/mp4', 'video/mpeg', 'video/quicktime', 'video/webm'
    ];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images and videos are allowed.'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit
    }
});

/**
 * Upload single media file
 */
const uploadMedia = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { description, tags, album_id } = req.body;
        const file = req.file;
        const fileType = file.mimetype.startsWith('image/') ? 'image' : 'video';

        let metadata = {};
        let thumbnailPath = null;

        // Process image
        if (fileType === 'image') {
            try {
                // Get image metadata
                const imageMeta = await getImageMetadata(file.path);
                metadata = imageMeta;

                // Generate thumbnail
                const thumbnailFilename = `thumb-${file.filename}`;
                const thumbnailFullPath = path.join(path.dirname(file.path), thumbnailFilename);
                await generateThumbnail(file.path, thumbnailFullPath);
                thumbnailPath = thumbnailFilename;
            } catch (error) {
                console.error('Error processing image:', error);
            }
        }

        // Create database record
        const mediaFile = await MediaFile.create({
            filename: file.filename,
            original_name: file.originalname,
            file_path: file.path,
            file_type: fileType,
            mime_type: file.mimetype,
            file_size: file.size,
            width: metadata.width || null,
            height: metadata.height || null,
            thumbnail_path: thumbnailPath,
            album_id: album_id || null,
            tags: tags ? JSON.parse(tags) : [],
            description: description || null,
            metadata: metadata,
            uploaded_by: req.user?.id || null
        });

        res.status(201).json({
            message: 'File uploaded successfully',
            media: mediaFile
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload file', details: error.message });
    }
};

/**
 * Upload multiple media files
 */
const uploadMultiple = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        const { album_id } = req.body;
        const uploadedMedia = [];

        for (const file of req.files) {
            const fileType = file.mimetype.startsWith('image/') ? 'image' : 'video';
            let metadata = {};
            let thumbnailPath = null;

            if (fileType === 'image') {
                try {
                    const imageMeta = await getImageMetadata(file.path);
                    metadata = imageMeta;

                    const thumbnailFilename = `thumb-${file.filename}`;
                    const thumbnailFullPath = path.join(path.dirname(file.path), thumbnailFilename);
                    await generateThumbnail(file.path, thumbnailFullPath);
                    thumbnailPath = thumbnailFilename;
                } catch (error) {
                    console.error('Error processing image:', error);
                }
            }

            const mediaFile = await MediaFile.create({
                filename: file.filename,
                original_name: file.originalname,
                file_path: file.path,
                file_type: fileType,
                mime_type: file.mimetype,
                file_size: file.size,
                width: metadata.width || null,
                height: metadata.height || null,
                thumbnail_path: thumbnailPath,
                album_id: album_id || null,
                tags: [],
                metadata: metadata,
                uploaded_by: req.user?.id || null
            });

            uploadedMedia.push(mediaFile);
        }

        res.status(201).json({
            message: `${uploadedMedia.length} files uploaded successfully`,
            media: uploadedMedia
        });
    } catch (error) {
        console.error('Bulk upload error:', error);
        res.status(500).json({ error: 'Failed to upload files', details: error.message });
    }
};

/**
 * Get all media files with filters
 */
const getMedia = async (req, res) => {
    try {
        const { file_type, album_id, tags, search, page = 1, limit = 50 } = req.query;
        const offset = (page - 1) * limit;

        const where = {};

        if (file_type) where.file_type = file_type;
        if (album_id) where.album_id = album_id;
        if (tags) {
            const tagArray = tags.split(',');
            where.tags = { [Op.overlap]: tagArray };
        }
        if (search) {
            where[Op.or] = [
                { original_name: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const { count, rows } = await MediaFile.findAndCountAll({
            where,
            include: [
                { model: MediaAlbum, as: 'album' },
                { model: User, as: 'uploader', attributes: ['id', 'name', 'email'] }
            ],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            media: rows,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        console.error('Get media error:', error);
        res.status(500).json({ error: 'Failed to fetch media', details: error.message });
    }
};

/**
 * Get single media file by ID
 */
const getMediaById = async (req, res) => {
    try {
        const { id } = req.params;

        const media = await MediaFile.findByPk(id, {
            include: [
                { model: MediaAlbum, as: 'album' },
                { model: User, as: 'uploader', attributes: ['id', 'name', 'email'] }
            ]
        });

        if (!media) {
            return res.status(404).json({ error: 'Media file not found' });
        }

        res.json(media);
    } catch (error) {
        console.error('Get media by ID error:', error);
        res.status(500).json({ error: 'Failed to fetch media', details: error.message });
    }
};

/**
 * Update media metadata
 */
const updateMedia = async (req, res) => {
    try {
        const { id } = req.params;
        const { description, tags, album_id } = req.body;

        const media = await MediaFile.findByPk(id);
        if (!media) {
            return res.status(404).json({ error: 'Media file not found' });
        }

        await media.update({
            description: description !== undefined ? description : media.description,
            tags: tags !== undefined ? tags : media.tags,
            album_id: album_id !== undefined ? album_id : media.album_id
        });

        res.json({
            message: 'Media updated successfully',
            media
        });
    } catch (error) {
        console.error('Update media error:', error);
        res.status(500).json({ error: 'Failed to update media', details: error.message });
    }
};

/**
 * Delete media file
 */
const deleteMedia = async (req, res) => {
    try {
        const { id } = req.params;

        const media = await MediaFile.findByPk(id);
        if (!media) {
            return res.status(404).json({ error: 'Media file not found' });
        }

        // Delete physical files
        try {
            await fs.unlink(media.file_path);
            if (media.thumbnail_path) {
                const thumbnailFullPath = path.join(path.dirname(media.file_path), media.thumbnail_path);
                await fs.unlink(thumbnailFullPath);
            }
        } catch (error) {
            console.error('Error deleting physical files:', error);
        }

        // Delete database record
        await media.destroy();

        res.json({ message: 'Media deleted successfully' });
    } catch (error) {
        console.error('Delete media error:', error);
        res.status(500).json({ error: 'Failed to delete media', details: error.message });
    }
};

/**
 * Create album
 */
const createAlbum = async (req, res) => {
    try {
        const { name, description, cover_image_id } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Album name is required' });
        }

        const album = await MediaAlbum.create({
            name,
            description,
            cover_image_id,
            created_by: req.user?.id || null
        });

        res.status(201).json({
            message: 'Album created successfully',
            album
        });
    } catch (error) {
        console.error('Create album error:', error);
        res.status(500).json({ error: 'Failed to create album', details: error.message });
    }
};

/**
 * Get all albums
 */
const getAlbums = async (req, res) => {
    try {
        const albums = await MediaAlbum.findAll({
            include: [
                { model: MediaFile, as: 'coverImage' },
                { model: MediaFile, as: 'mediaFiles' },
                { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json(albums);
    } catch (error) {
        console.error('Get albums error:', error);
        res.status(500).json({ error: 'Failed to fetch albums', details: error.message });
    }
};

/**
 * Update album
 */
const updateAlbum = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, cover_image_id } = req.body;

        const album = await MediaAlbum.findByPk(id);
        if (!album) {
            return res.status(404).json({ error: 'Album not found' });
        }

        await album.update({
            name: name !== undefined ? name : album.name,
            description: description !== undefined ? description : album.description,
            cover_image_id: cover_image_id !== undefined ? cover_image_id : album.cover_image_id
        });

        res.json({
            message: 'Album updated successfully',
            album
        });
    } catch (error) {
        console.error('Update album error:', error);
        res.status(500).json({ error: 'Failed to update album', details: error.message });
    }
};

module.exports = {
    upload,
    uploadMedia,
    uploadMultiple,
    getMedia,
    getMediaById,
    updateMedia,
    deleteMedia,
    createAlbum,
    getAlbums,
    updateAlbum
};
