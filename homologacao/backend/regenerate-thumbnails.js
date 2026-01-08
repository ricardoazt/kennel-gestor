/**
 * Script to regenerate all thumbnails with new aspect-ratio-preserving settings
 */

const { MediaFile } = require('./models');
const { generateThumbnail, generateVideoThumbnail } = require('./utils/imageProcessor');
const path = require('path');
const fs = require('fs').promises;

async function regenerateThumbnails() {
    try {
        console.log('Starting thumbnail regeneration...');

        // Get all media files
        const mediaFiles = await MediaFile.findAll();
        console.log(`Found ${mediaFiles.length} media files`);

        let successCount = 0;
        let errorCount = 0;

        for (const media of mediaFiles) {
            try {
                const originalPath = path.join(__dirname, 'uploads', 'media', media.filename);

                // Check if original file exists
                try {
                    await fs.access(originalPath);
                } catch (err) {
                    console.log(`Skipping ${media.filename} - original file not found`);
                    continue;
                }

                // Generate new thumbnail
                const thumbnailFilename = media.file_type === 'video'
                    ? `thumb-${media.filename}.jpg`
                    : `thumb-${media.filename}`;
                const thumbnailPath = path.join(__dirname, 'uploads', 'media', thumbnailFilename);

                console.log(`Regenerating thumbnail for: ${media.filename}`);

                if (media.file_type === 'image') {
                    await generateThumbnail(originalPath, thumbnailPath);
                } else if (media.file_type === 'video') {
                    await generateVideoThumbnail(originalPath, thumbnailPath);
                }

                // Update database if thumbnail path changed
                if (media.thumbnail_path !== thumbnailFilename) {
                    await media.update({ thumbnail_path: thumbnailFilename });
                }

                successCount++;
                console.log(`✓ Successfully regenerated: ${media.filename}`);
            } catch (error) {
                errorCount++;
                console.error(`✗ Error regenerating ${media.filename}:`, error.message);
            }
        }

        console.log('\n=== Regeneration Complete ===');
        console.log(`Success: ${successCount}`);
        console.log(`Errors: ${errorCount}`);
        console.log(`Total: ${mediaFiles.length}`);

        process.exit(0);
    } catch (error) {
        console.error('Fatal error:', error);
        process.exit(1);
    }
}

regenerateThumbnails();
