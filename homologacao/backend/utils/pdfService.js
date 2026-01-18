const PDFDocument = require('pdfkit');
const qrCodeService = require('./qrCodeService');

/**
 * Service for generating PDF documents
 */
class PDFService {
    /**
     * Generate litter PDF document
     * @param {object} litter - Litter data with father, mother, and puppies
     * @param {string} baseUrl - Base URL for QR codes
     * @returns {Promise<Buffer>} PDF buffer
     */
    async generateLitterPDF(litter, baseUrl) {
        return new Promise(async (resolve, reject) => {
            try {
                const doc = new PDFDocument({
                    size: 'A4',
                    margins: { top: 50, bottom: 50, left: 50, right: 50 }
                });

                const buffers = [];
                doc.on('data', buffers.push.bind(buffers));
                doc.on('end', () => {
                    const pdfBuffer = Buffer.concat(buffers);
                    resolve(pdfBuffer);
                });

                // Header
                doc.fontSize(24)
                    .font('Helvetica-Bold')
                    .text('Prontuário da Ninhada', { align: 'center' });

                doc.moveDown(0.5);
                doc.fontSize(16)
                    .font('Helvetica')
                    .text(litter.name || `Ninhada #${litter.id}`, { align: 'center' });

                doc.moveDown(1);

                // Birth date
                if (litter.birth_date) {
                    doc.fontSize(12)
                        .font('Helvetica-Bold')
                        .text('Data de Nascimento: ', { continued: true })
                        .font('Helvetica')
                        .text(new Date(litter.birth_date).toLocaleDateString('pt-BR'));
                    doc.moveDown(0.5);
                }

                // Parents section
                doc.fontSize(14)
                    .font('Helvetica-Bold')
                    .text('Informações dos Pais');

                doc.moveDown(0.3);
                doc.strokeColor('#cccccc')
                    .lineWidth(1)
                    .moveTo(50, doc.y)
                    .lineTo(545, doc.y)
                    .stroke();
                doc.moveDown(0.5);

                // Mother
                doc.fontSize(12)
                    .font('Helvetica-Bold')
                    .fillColor('#d946a6')
                    .text('♀ Mãe: ', { continued: true })
                    .fillColor('#000000')
                    .font('Helvetica')
                    .text(litter.Mother?.nome || 'N/A');

                if (litter.Mother?.registro) {
                    doc.fontSize(10)
                        .fillColor('#666666')
                        .text(`   Registro: ${litter.Mother.registro}`);
                }
                doc.moveDown(0.5);

                // Father
                doc.fontSize(12)
                    .font('Helvetica-Bold')
                    .fillColor('#3b82f6')
                    .text('♂ Pai: ', { continued: true })
                    .fillColor('#000000')
                    .font('Helvetica')
                    .text(litter.Father?.nome || 'N/A');

                if (litter.Father?.registro) {
                    doc.fontSize(10)
                        .fillColor('#666666')
                        .text(`   Registro: ${litter.Father.registro}`);
                }
                doc.moveDown(1.5);

                // Puppies section
                doc.fontSize(14)
                    .font('Helvetica-Bold')
                    .fillColor('#000000')
                    .text('Filhotes da Ninhada');

                doc.moveDown(0.3);
                doc.strokeColor('#cccccc')
                    .lineWidth(1)
                    .moveTo(50, doc.y)
                    .lineTo(545, doc.y)
                    .stroke();
                doc.moveDown(1);

                // Generate QR codes and puppy cards
                const puppies = litter.puppies || [];

                for (let i = 0; i < puppies.length; i++) {
                    const puppy = puppies[i];

                    // Check if we need a new page
                    if (doc.y > 650) {
                        doc.addPage();
                    }

                    const startY = doc.y;

                    // Draw puppy card border
                    doc.rect(50, startY, 495, 140)
                        .stroke();

                    // Puppy info (left side)
                    doc.fontSize(14)
                        .font('Helvetica-Bold')
                        .fillColor(puppy.gender === 'Macho' ? '#3b82f6' : '#d946a6')
                        .text(`${puppy.gender === 'Macho' ? '♂' : '♀'} ${puppy.name || `Filhote #${i + 1}`}`, 60, startY + 10);

                    doc.fontSize(10)
                        .fillColor('#000000')
                        .font('Helvetica');

                    let infoY = startY + 35;

                    if (puppy.unique_code) {
                        doc.text(`Código: ${puppy.unique_code}`, 60, infoY);
                        infoY += 15;
                    }

                    if (puppy.coat_color) {
                        doc.text(`Coloração: ${puppy.coat_color}`, 60, infoY);
                        infoY += 15;
                    }

                    if (puppy.collar_color) {
                        doc.text(`Cor da Coleira: ${puppy.collar_color}`, 60, infoY);
                        infoY += 15;
                    }

                    if (puppy.status) {
                        const statusText = puppy.status === 'available' ? 'Disponível' :
                            puppy.status === 'reserved' ? 'Reservado' : 'Vendido';
                        doc.text(`Status: ${statusText}`, 60, infoY);
                    }

                    // QR Code (right side)
                    if (puppy.unique_code) {
                        try {
                            const qrUrl = qrCodeService.generatePuppyProfileURL(puppy.unique_code, baseUrl);
                            const qrBuffer = await qrCodeService.generateQRCodeBuffer(qrUrl, { width: 100 });

                            doc.image(qrBuffer, 435, startY + 20, {
                                width: 100,
                                height: 100
                            });

                            doc.fontSize(8)
                                .fillColor('#666666')
                                .text('Escaneie para perfil', 435, startY + 125, {
                                    width: 100,
                                    align: 'center'
                                });
                        } catch (error) {
                            console.error('Error generating QR code for puppy:', error);
                        }
                    }

                    doc.moveDown(2);
                    if (doc.y < startY + 150) {
                        doc.y = startY + 150;
                    }
                }

                // Footer
                doc.fontSize(8)
                    .fillColor('#999999')
                    .text(
                        `Documento gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`,
                        50,
                        doc.page.height - 50,
                        { align: 'center' }
                    );

                doc.end();
            } catch (error) {
                console.error('Error generating PDF:', error);
                reject(error);
            }
        });
    }
}

module.exports = new PDFService();
