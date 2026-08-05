const PdfPrinter = require('pdfmake');
const path = require('path');

class PDFService {
  /**
   * Generates a PDF buffer from a pdfmake document definition
   * @param {object} docDefinition - The pdfmake document definition
   * @returns {Promise<Buffer>} - The generated PDF buffer
   */
  async generatePDF(docDefinition) {
    try {
      // Use embedded Roboto fonts to prevent blurriness
      const fonts = {
        Roboto: {
          normal: path.join(__dirname, '../node_modules/pdfmake/fonts/Roboto/Roboto-Regular.ttf'),
          bold: path.join(__dirname, '../node_modules/pdfmake/fonts/Roboto/Roboto-Medium.ttf'),
          italics: path.join(__dirname, '../node_modules/pdfmake/fonts/Roboto/Roboto-Italic.ttf'),
          bolditalics: path.join(__dirname, '../node_modules/pdfmake/fonts/Roboto/Roboto-MediumItalic.ttf')
        }
      };

      const printer = new PdfPrinter(fonts);
      
      // Ensure default font is applied
      docDefinition.defaultStyle = docDefinition.defaultStyle || {};
      docDefinition.defaultStyle.font = 'Roboto';

      // Create PDF Kit Document
      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      
      return new Promise((resolve, reject) => {
        let chunks = [];
        pdfDoc.on('data', (chunk) => {
          chunks.push(chunk);
        });
        pdfDoc.on('end', () => {
          resolve(Buffer.concat(chunks));
        });
        pdfDoc.on('error', (err) => {
          reject(err);
        });
        pdfDoc.end();
      });
    } catch (error) {
      console.error('Error generating PDF with PDFMake:', error);
      throw error;
    }
  }
}

module.exports = new PDFService();
