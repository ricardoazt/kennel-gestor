const { generateVideoThumbnail } = require('./utils/imageProcessor');
const path = require('path');
const fs = require('fs');

async function test() {
    const inputPath = '/app/uploads/media/media-1767570274482-158602011.mp4';
    const outputPath = '/app/uploads/media/test-thumb-square.jpg';

    console.log('Starting square video thumbnail generation test...');

    try {
        const metadata = await generateVideoThumbnail(inputPath, outputPath, 300);
        console.log('Success! Metadata:', metadata);

        if (fs.existsSync(outputPath)) {
            console.log('Thumbnail file created successfully.');
            if (metadata.width === 300 && metadata.height === 300) {
                console.log('CONFIRMED: Thumbnail is a perfect 300x300 square.');
            } else {
                console.error('ERROR: Thumbnail dimensions are incorrect:', metadata.width, 'x', metadata.height);
            }
        } else {
            console.error('Error: Thumbnail file was not created.');
        }
    } catch (error) {
        console.error('Test failed:', error);
    }
}

test();
