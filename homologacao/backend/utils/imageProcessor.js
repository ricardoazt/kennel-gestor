/**
 * Image Processing Utility
 * Uses sharp library for image optimization, resizing, and thumbnail generation
 */

const sharp = require('sharp');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs').promises;

/**
 * Generate thumbnail for a video
 * @param {string} inputPath - Path to original video
 * @param {string} outputPath - Path to save thumbnail
 * @param {number} size - Thumbnail size (default: 300)
 * @returns {Promise<object>} - Thumbnail metadata
 */
async function generateVideoThumbnail(inputPath, outputPath, size = 300) {
    const tempPath = `${outputPath}.temp.jpg`;

    return new Promise((resolve, reject) => {
        const outputDir = path.dirname(tempPath);
        const outputFilename = path.basename(tempPath);

        ffmpeg(inputPath)
            .screenshots({
                timestamps: ['00:00:01'], // Take screenshot at 1 second
                filename: outputFilename,
                folder: outputDir,
                size: '720x?' // Extract at a decent resolution first
            })
            .on('end', async () => {
                try {
                    // Use sharp to create a square, centered crop
                    const metadata = await sharp(tempPath)
                        .resize(size, size, {
                            fit: 'cover',
                            position: 'center'
                        })
                        .jpeg({ quality: 80 })
                        .toFile(outputPath);

                    // Clean up temp file
                    await fs.unlink(tempPath);

                    resolve({
                        width: metadata.width,
                        height: metadata.height,
                        size: (await fs.stat(outputPath)).size
                    });
                } catch (error) {
                    // Try to clean up temp file even on error
                    try { await fs.unlink(tempPath); } catch (e) { }
                    reject(error);
                }
            })
            .on('error', (err) => {
                console.error('Error generating video thumbnail:', err);
                reject(err);
            });
    });
}

/**
 * Generate thumbnail for an image
 * @param {string} inputPath - Path to original image
 * @param {string} outputPath - Path to save thumbnail
 * @param {number} size - Thumbnail size (default: 300x300)
 * @returns {Promise<object>} - Thumbnail metadata
 */
async function generateThumbnail(inputPath, outputPath, size = 300) {
    try {
        const metadata = await sharp(inputPath)
            .resize(size, size, {
                fit: 'cover',
                position: 'center'
            })
            .jpeg({ quality: 80 })
            .toFile(outputPath);

        return {
            width: metadata.width,
            height: metadata.height,
            size: metadata.size
        };
    } catch (error) {
        console.error('Error generating thumbnail:', error);
        throw error;
    }
}

/**
 * Generate social media variants of an image
 * @param {string} inputPath - Path to original image
 * @param {string} baseOutputPath - Base path for output files (without extension)
 * @returns {Promise<object>} - Paths to generated variants
 */
async function generateSocialMediaVariants(inputPath, baseOutputPath) {
    const variants = {};

    try {
        // Instagram square (1080x1080)
        const instagramPath = `${baseOutputPath}_instagram.jpg`;
        await sharp(inputPath)
            .resize(1080, 1080, { fit: 'cover', position: 'center' })
            .jpeg({ quality: 85 })
            .toFile(instagramPath);
        variants.instagram = instagramPath;

        // Facebook/Twitter (1200x630)
        const facebookPath = `${baseOutputPath}_facebook.jpg`;
        await sharp(inputPath)
            .resize(1200, 630, { fit: 'cover', position: 'center' })
            .jpeg({ quality: 85 })
            .toFile(facebookPath);
        variants.facebook = facebookPath;

        // WhatsApp (800x800)
        const whatsappPath = `${baseOutputPath}_whatsapp.jpg`;
        await sharp(inputPath)
            .resize(800, 800, { fit: 'cover', position: 'center' })
            .jpeg({ quality: 80 })
            .toFile(whatsappPath);
        variants.whatsapp = whatsappPath;

        return variants;
    } catch (error) {
        console.error('Error generating social media variants:', error);
        throw error;
    }
}

/**
 * Optimize an image (compress and convert if needed)
 * @param {string} inputPath - Path to original image
 * @param {string} outputPath - Path to save optimized image
 * @param {number} quality - JPEG quality (default: 85)
 * @returns {Promise<object>} - Optimized image metadata
 */
async function optimizeImage(inputPath, outputPath, quality = 85) {
    try {
        const metadata = await sharp(inputPath)
            .jpeg({ quality, progressive: true })
            .toFile(outputPath);

        return {
            width: metadata.width,
            height: metadata.height,
            size: metadata.size,
            format: metadata.format
        };
    } catch (error) {
        console.error('Error optimizing image:', error);
        throw error;
    }
}

/**
 * Extract image metadata
 * @param {string} imagePath - Path to image
 * @returns {Promise<object>} - Image metadata
 */
async function getImageMetadata(imagePath) {
    try {
        const metadata = await sharp(imagePath).metadata();
        return {
            width: metadata.width,
            height: metadata.height,
            format: metadata.format,
            space: metadata.space,
            channels: metadata.channels,
            depth: metadata.depth,
            density: metadata.density,
            hasAlpha: metadata.hasAlpha
        };
    } catch (error) {
        console.error('Error extracting metadata:', error);
        throw error;
    }
}

/**
 * Add watermark to an image
 * @param {string} inputPath - Path to original image
 * @param {string} watermarkPath - Path to watermark image
 * @param {string} outputPath - Path to save watermarked image
 * @param {string} position - Watermark position (default: 'southeast')
 * @returns {Promise<object>} - Watermarked image metadata
 */
async function addWatermark(inputPath, watermarkPath, outputPath, position = 'southeast') {
    try {
        const watermark = await sharp(watermarkPath)
            .resize(200) // Resize watermark to 200px width
            .toBuffer();

        const metadata = await sharp(inputPath)
            .composite([{
                input: watermark,
                gravity: position
            }])
            .toFile(outputPath);

        return {
            width: metadata.width,
            height: metadata.height,
            size: metadata.size
        };
    } catch (error) {
        console.error('Error adding watermark:', error);
        throw error;
    }
}

/**
 * Create an Open Graph preview image with text overlay
 * @param {string} backgroundPath - Path to background image
 * @param {string} title - Campaign title
 * @param {string} outputPath - Path to save OG image
 * @returns {Promise<string>} - Path to generated image
 */
async function createOGImage(backgroundPath, title, outputPath) {
    try {
        // Create a 1200x630 image with the background
        const image = sharp(backgroundPath)
            .resize(1200, 630, { fit: 'cover', position: 'center' });

        // Add a semi-transparent overlay for text readability
        const overlay = Buffer.from(
            `<svg width="1200" height="630">
        <rect x="0" y="0" width="1200" height="630" fill="rgba(0,0,0,0.4)"/>
      </svg>`
        );

        await image
            .composite([{ input: overlay, blend: 'over' }])
            .jpeg({ quality: 90 })
            .toFile(outputPath);

        return outputPath;
    } catch (error) {
        console.error('Error creating OG image:', error);
        throw error;
    }
}

module.exports = {
    generateThumbnail,
    generateVideoThumbnail,
    generateSocialMediaVariants,
    optimizeImage,
    getImageMetadata,
    addWatermark,
    createOGImage
};
