const { generateVideoThumbnail } = require('./utils/imageProcessor');
const path = require('path');
const fs = require('fs');

async function test() {
    const inputPath = '/app/uploads/media/media-1767566984120-729981113.mp4';
    const outputPath = '/app/uploads/media/test-thumb.jpg';

    console.log('Starting video thumbnail generation test...');
    console.log('Input:', inputPath);
    console.log('Output:', outputPath);

    try {
        const metadata = await generateVideoThumbnail(inputPath, outputPath);
        console.log('Success! Metadata:', metadata);

        if (fs.existsSync(outputPath)) {
            console.log('Thumbnail file created successfully.');
            const stats = fs.statSync(outputPath);
            console.log('File size:', stats.size, 'bytes');
        } else {
            console.error('Error: Thumbnail file was not created.');
        }
    } catch (error) {
        console.error('Test failed:', error);
    }
}

test();
