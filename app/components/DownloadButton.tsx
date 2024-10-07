import React from 'react'

interface DownloadButtonProps {
  pdfUrl: string | null;
  title: string;
}

export function DownloadButton({ pdfUrl, title }: DownloadButtonProps) {
  const downloadPDF = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `${title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <button
      onClick={downloadPDF}
      disabled={!pdfUrl}
      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Descargar PDF
    </button>
  );
}