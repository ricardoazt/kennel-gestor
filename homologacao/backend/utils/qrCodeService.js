const QRCode = require('qrcode');

/**
 * Service for generating QR codes
 */
class QRCodeService {
    /**
     * Generate QR code as base64 data URL
     * @param {string} data - Data to encode in QR code (e.g., unique code or URL)
     * @param {object} options - QR code options
     * @returns {Promise<string>} Base64 data URL of QR code image
     */
    async generateQRCode(data, options = {}) {
        try {
            const defaultOptions = {
                errorCorrectionLevel: 'H',
                type: 'image/png',
                quality: 0.95,
                margin: 1,
                width: 300,
                ...options
            };

            const qrCodeDataURL = await QRCode.toDataURL(data, defaultOptions);
            return qrCodeDataURL;
        } catch (error) {
            console.error('Error generating QR code:', error);
            throw new Error('Failed to generate QR code');
        }
    }

    /**
     * Generate QR code as buffer
     * @param {string} data - Data to encode in QR code
     * @param {object} options - QR code options
     * @returns {Promise<Buffer>} QR code image buffer
     */
    async generateQRCodeBuffer(data, options = {}) {
        try {
            const defaultOptions = {
                errorCorrectionLevel: 'H',
                type: 'png',
                quality: 0.95,
                margin: 1,
                width: 300,
                ...options
            };

            const qrCodeBuffer = await QRCode.toBuffer(data, defaultOptions);
            return qrCodeBuffer;
        } catch (error) {
            console.error('Error generating QR code buffer:', error);
            throw new Error('Failed to generate QR code buffer');
        }
    }

    /**
     * Generate QR code URL for puppy profile
     * @param {string} uniqueCode - Puppy unique code
     * @param {string} baseUrl - Base URL of the application
     * @returns {string} Full URL to puppy profile
     */
    generatePuppyProfileURL(uniqueCode, baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000') {
        return `${baseUrl}/f/${uniqueCode}`;
    }
}

module.exports = new QRCodeService();
