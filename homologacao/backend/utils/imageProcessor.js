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
 * @param {number} maxSize - Maximum width or height (default: 400)
 * @returns {Promise<object>} - Thumbnail metadata
 */
async function generateVideoThumbnail(inputPath, outputPath, maxSize = 400) {
    const tempPath = `${outputPath}.temp.jpg`;

    return new Promise((resolve, reject) => {
        const outputDir = path.dirname(tempPath);
        const outputFilename = path.basename(tempPath);

        ffmpeg(inputPath)
            .screenshots({
                timestamps: ['00:00:01'], // Take screenshot at 1 second
                filename: outputFilename,
                folder: outputDir,
                size: '1280x?' // Extract at a decent resolution first
            })
            .on('end', async () => {
                try {
                    // Use sharp to resize while preserving aspect ratio
                    const metadata = await sharp(tempPath)
                        .resize(maxSize, maxSize, {
                            fit: 'inside', // Preserve aspect ratio, don't crop
                            withoutEnlargement: true
                        })
                        .jpeg({ quality: 85 })
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
 * @param {number} maxSize - Maximum width or height (default: 400)
 * @returns {Promise<object>} - Thumbnail metadata
 */
async function generateThumbnail(inputPath, outputPath, maxSize = 400) {
    try {
        const metadata = await sharp(inputPath)
            .resize(maxSize, maxSize, {
                fit: 'inside', // Preserve aspect ratio, don't crop
                withoutEnlargement: true // Don't upscale small images
            })
            .jpeg({ quality: 85 })
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
 * Optimize and resize an image (compress, resize, and convert if needed)
 * This is the main function used for uploaded images
 * @param {string} inputPath - Path to original image
 * @param {string} outputPath - Path to save optimized image (can be same as input)
 * @param {object} options - Optimization options
 * @returns {Promise<object>} - Optimized image metadata
 */
async function optimizeAndResizeImage(inputPath, outputPath, options = {}) {
    const {
        maxWidth = 1920,
        maxHeight = 1920,
        quality = 85,
        convertPngToJpeg = true,
        progressive = true
    } = options;

    try {
        // Get original metadata
        const originalMeta = await sharp(inputPath).metadata();

        // Check if PNG should be converted to JPEG
        const shouldConvertToJpeg = convertPngToJpeg &&
            originalMeta.format === 'png' &&
            !originalMeta.hasAlpha;

        let pipeline = sharp(inputPath);

        // Resize if image is larger than max dimensions
        if (originalMeta.width > maxWidth || originalMeta.height > maxHeight) {
            pipeline = pipeline.resize(maxWidth, maxHeight, {
                fit: 'inside',
                withoutEnlargement: true
            });
        }

        // Convert to JPEG and optimize
        if (shouldConvertToJpeg || originalMeta.format === 'jpeg' || originalMeta.format === 'jpg') {
            pipeline = pipeline.jpeg({
                quality,
                progressive,
                mozjpeg: true // Use mozjpeg for better compression
            });
        } else if (originalMeta.format === 'png') {
            // Optimize PNG
            pipeline = pipeline.png({
                quality,
                compressionLevel: 9,
                progressive
            });
        } else if (originalMeta.format === 'webp') {
            pipeline = pipeline.webp({ quality });
        } else {
            // Default to JPEG for other formats
            pipeline = pipeline.jpeg({ quality, progressive });
        }

        const metadata = await pipeline.toFile(outputPath);

        const stats = await fs.stat(outputPath);

        return {
            width: metadata.width,
            height: metadata.height,
            size: stats.size,
            format: metadata.format,
            originalSize: (await fs.stat(inputPath)).size,
            compressionRatio: ((1 - (stats.size / (await fs.stat(inputPath)).size)) * 100).toFixed(2)
        };
    } catch (error) {
        console.error('Error optimizing and resizing image:', error);
        throw error;
    }
}

/**
 * Legacy optimize function - now calls optimizeAndResizeImage
 * @deprecated Use optimizeAndResizeImage instead
 */
async function optimizeImage(inputPath, outputPath, quality = 85) {
    return optimizeAndResizeImage(inputPath, outputPath, { quality });
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

/**
 * Optimize and compress a video
 * @param {string} inputPath - Path to original video
 * @param {string} outputPath - Path to save optimized video
 * @param {object} options - Optimization options
 * @returns {Promise<object>} - Optimized video metadata
 */
async function optimizeVideo(inputPath, outputPath, options = {}) {
    const {
        maxWidth = 1920,
        maxHeight = 1080,
        videoBitrate = '2000k',
        audioBitrate = '128k',
        codec = 'libx264',
        audioCodec = 'aac'
    } = options;

    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .videoCodec(codec)
            .audioCodec(audioCodec)
            .videoBitrate(videoBitrate)
            .audioBitrate(audioBitrate)
            .size(`${maxWidth}x?`) // Maintain aspect ratio
            .outputOptions([
                '-preset fast', // Faster encoding
                '-crf 23', // Constant Rate Factor (quality: 0-51, lower is better)
                '-movflags +faststart', // Enable streaming
                '-pix_fmt yuv420p' // Compatibility
            ])
            .on('end', async () => {
                try {
                    const stats = await fs.stat(outputPath);
                    const originalStats = await fs.stat(inputPath);

                    resolve({
                        size: stats.size,
                        originalSize: originalStats.size,
                        compressionRatio: ((1 - (stats.size / originalStats.size)) * 100).toFixed(2)
                    });
                } catch (error) {
                    reject(error);
                }
            })
            .on('error', (err) => {
                console.error('Error optimizing video:', err);
                reject(err);
            })
            .save(outputPath);
    });
}

module.exports = {
    generateThumbnail,
    generateVideoThumbnail,
    generateSocialMediaVariants,
    optimizeImage,
    optimizeAndResizeImage,
    optimizeVideo,
    getImageMetadata,
    addWatermark,
    createOGImage
};
