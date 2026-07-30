import React, { useState } from 'react';
import { downloadElementAsPDF } from './pdfGenerator';
import { Download, Loader2 } from 'lucide-react';

export default function DownloadInvoiceButton({ targetId, fileName = "FlyAnyTrip-Invoice.pdf", className = "", text = "Download Invoice" }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    const success = await downloadElementAsPDF(targetId, fileName);
    if (!success) {
      alert("Failed to generate PDF. Please ensure all images have loaded and try again.");
    }
    setIsDownloading(false);
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className={`flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 font-bold py-2.5 px-5 rounded shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
    >
      {isDownloading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Download className="w-5 h-5" />
      )}
      <span>{isDownloading ? "Generating PDF..." : text}</span>
    </button>
  );
}
