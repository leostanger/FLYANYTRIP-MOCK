import domtoimage from 'dom-to-image-more';
import { jsPDF } from 'jspdf';

/**
 * Helper to pre-convert external images inside an element to Base64 Data URLs so domtoimage can capture them without CORS issues.
 */
const prepareContainerImages = async (container) => {
  const images = Array.from(container.querySelectorAll('img'));
  await Promise.all(images.map(async (img) => {
    if (img.src && !img.src.startsWith('data:') && !img.src.startsWith('blob:')) {
      try {
        const response = await fetch(img.src, { mode: 'cors' });
        if (response.ok) {
          const blob = await response.blob();
          const dataUrl = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(blob);
          });
          if (dataUrl) img.src = dataUrl;
        }
      } catch (e) {
        // Fallback gracefully
      }
    }
  }));
};

/**
 * Captures an HTML element and downloads it as a multi-page or single-page PDF file.
 * 
 * @param {string} elementId - The ID of the HTML element to capture.
 * @param {string} fileName - The desired name of the downloaded PDF.
 * @returns {Promise<boolean>} - True if successful, false otherwise.
 */
export const downloadElementAsPDF = async (elementId, fileName = 'FlyAnyTrip-Invoice.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID ${elementId} not found.`);
    return false;
  }

  try {
    // Convert external images to Data URLs so domtoimage doesn't drop them
    await prepareContainerImages(element);

    const pageElements = element.querySelectorAll('.invoice-page-single');
    const pdf = new jsPDF('p', 'mm', 'a4'); // Standard A4 (210mm x 297mm)

    if (pageElements && pageElements.length > 0) {
      for (let i = 0; i < pageElements.length; i++) {
        const pageEl = pageElements[i];
        const imgData = await domtoimage.toPng(pageEl, {
          bgcolor: '#ffffff',
          scale: 2,
          cacheBust: true,
          style: { transform: 'scale(1)', transformOrigin: 'top left' }
        });

        if (i > 0) pdf.addPage('a4', 'p');
        pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
      }
    } else {
      const imgData = await domtoimage.toPng(element, {
        bgcolor: '#ffffff',
        scale: 2,
        cacheBust: true,
        style: { transform: 'scale(1)', transformOrigin: 'top left' }
      });
      const img = new Image();
      img.src = imgData;
      await new Promise((resolve) => { img.onload = resolve; });
      const pdfWidth = 210;
      const pdfHeight = (img.height * pdfWidth) / img.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    }

    pdf.save(fileName);
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
};

/**
 * Captures an HTML element and returns its Base64 PDF string.
 * Used to send the exact downloaded ticket PDF via email.
 * 
 * @param {string} elementId - The ID of the HTML element to capture.
 * @returns {Promise<string|null>} - Base64 encoded PDF string or null if failed.
 */
export const generateElementAsPDFBase64 = async (elementId) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID ${elementId} not found.`);
    return null;
  }

  try {
    const pageElements = element.querySelectorAll('.invoice-page-single');
    const pdf = new jsPDF('p', 'mm', 'a4');

    if (pageElements && pageElements.length > 0) {
      for (let i = 0; i < pageElements.length; i++) {
        const pageEl = pageElements[i];
        const imgData = await domtoimage.toPng(pageEl, {
          bgcolor: '#ffffff',
          scale: 1.5,
          cacheBust: false,
          style: { transform: 'scale(1)', transformOrigin: 'top left' }
        });

        if (i > 0) pdf.addPage('a4', 'p');
        pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
      }
    } else {
      const imgData = await domtoimage.toPng(element, {
        bgcolor: '#ffffff',
        scale: 1.5,
        cacheBust: false,
        style: { transform: 'scale(1)', transformOrigin: 'top left' }
      });
      const img = new Image();
      img.src = imgData;
      await new Promise((resolve) => { 
        img.onload = resolve; 
        img.onerror = resolve;
      });
      const pdfWidth = 210;
      const pdfHeight = (img.height * pdfWidth) / img.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    }

    const dataUri = pdf.output('datauristring');
    const base64 = dataUri ? dataUri.split(',')[1] : null;
    return base64;
  } catch (error) {
    console.warn("DOM PDF capture skipped:", error);
    return null;
  }
};

