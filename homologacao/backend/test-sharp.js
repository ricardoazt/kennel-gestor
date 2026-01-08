const sharp = require('sharp');
console.log('Sharp version:', sharp.versions);
sharp({
    create: {
        width: 100,
        height: 100,
        channels: 4,
        background: { r: 255, g: 0, b: 0, alpha: 0.5 }
    }
})
    .png()
    .toBuffer()
    .then(() => console.log('Sharp is working'))
    .catch(err => console.error('Sharp error:', err));
