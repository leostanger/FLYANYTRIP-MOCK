const PdfPrinter = require('pdfmake');
const vfsFonts = require('pdfmake/build/vfs_fonts');

// pdfmake v0.2 server-side: fonts are embedded in the virtual file system (vfs)
// We pass them directly as base64 buffers from the vfs bundle.
const fonts = {
  Roboto: {
    normal: Buffer.from(vfsFonts.pdfMake.vfs['Roboto-Regular.ttf'], 'base64'),
    bold: Buffer.from(vfsFonts.pdfMake.vfs['Roboto-Medium.ttf'], 'base64'),
    italics: Buffer.from(vfsFonts.pdfMake.vfs['Roboto-Italic.ttf'], 'base64'),
    bolditalics: Buffer.from(vfsFonts.pdfMake.vfs['Roboto-MediumItalic.ttf'], 'base64')
  }
};

const printer = new PdfPrinter(fonts);

class PDFService {
  /**
   * Generates a PDF buffer from a pdfmake document definition
   * @param {object} docDefinition - The pdfmake document definition
   * @returns {Promise<Buffer>} - The generated PDF buffer
   */
  async generatePDF(docDefinition) {
    return new Promise((resolve, reject) => {
      try {
        // Ensure default font is applied
        docDefinition.defaultStyle = docDefinition.defaultStyle || {};
        if (!docDefinition.defaultStyle.font) {
          docDefinition.defaultStyle.font = 'Roboto';
        }

        const pdfDoc = printer.createPdfKitDocument(docDefinition);

        const chunks = [];
        pdfDoc.on('data', (chunk) => chunks.push(chunk));
        pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
        pdfDoc.on('error', (err) => reject(err));
        pdfDoc.end();
      } catch (error) {
        console.error('Error generating PDF with PDFMake:', error);
        reject(error);
      }
    });
  }
}

module.exports = new PDFService();
