import React, { useState, useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { PDFDocument } from '../types'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import htmlToPdfmake from 'html-to-pdfmake'
import { TDocumentDefinitions } from 'pdfmake/interfaces'

pdfMake.vfs = pdfFonts.pdfMake.vfs;

interface ExtendedTDocumentDefinitions extends TDocumentDefinitions {
  columns?: number;
}

interface MainContentProps {
  markdown: string;
  setMarkdown: (markdown: string) => void;
  title: string;
  setTitle: (title: string) => void;
  documents: PDFDocument[];
  setDocuments: (docs: PDFDocument[]) => void;
  setCurrentDocument: (doc: PDFDocument | null) => void;
  darkMode: boolean;
  fontSettings: {
    titleSize: number;
    subtitleSize: number;
    subsubtitleSize: number;
    normalTextSize: number;
    selectedFont: string;
    titleColor: string;
    subtitleColor: string;
    subsubtitleColor: string;
    twoColumnLayout: boolean;
  };
}

export function MainContent({
  markdown,
  setMarkdown,
  title,
  setTitle,
  documents,
  setDocuments,
  setCurrentDocument,
  darkMode,
  fontSettings,
}: MainContentProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = useCallback(async () => {
    setIsGenerating(true);
    try {
      // Convert Markdown to HTML
      const htmlContent = await new Promise<string>((resolve) => {
        const result = ReactMarkdown({
          children: markdown,
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeRaw],
          components: {
            h1: ({children}) => <h1 style={{fontSize: `${fontSettings.titleSize}px`, fontWeight: 'bold', color: fontSettings.titleColor}}>{children}</h1>,
            h2: ({children}) => <h2 style={{fontSize: `${fontSettings.subtitleSize}px`, fontWeight: 'bold', color: fontSettings.subtitleColor}}>{children}</h2>,
            h3: ({children}) => <h3 style={{fontSize: `${fontSettings.subsubtitleSize}px`, fontWeight: 'bold', color: fontSettings.subsubtitleColor}}>{children}</h3>,
            p: ({children}) => <p style={{fontSize: `${fontSettings.normalTextSize}px`, marginBottom: '10px'}}>{children}</p>,
            span: ({children}) => <span>{children}</span>,
          },
        });
        resolve(result as unknown as string);
      });

      // Convert HTML to pdfmake content
      const content = htmlToPdfmake(htmlContent, {
        tableAutoSize: true,
        imagesByReference: true,
        defaultStyles: {
          h1: { fontSize: fontSettings.titleSize, bold: true, color: fontSettings.titleColor, margin: [0, 20, 0, 10] },
          h2: { fontSize: fontSettings.subtitleSize, bold: true, color: fontSettings.subtitleColor, margin: [0, 15, 0, 7] },
          h3: { fontSize: fontSettings.subsubtitleSize, bold: true, color: fontSettings.subsubtitleColor, margin: [0, 10, 0, 5] },
          p: { fontSize: fontSettings.normalTextSize, margin: [0, 0, 0, 10] },
        },
      });

      const docDefinition: ExtendedTDocumentDefinitions = {
        content: [
          { text: title, style: 'header' },
          { text: '\n' },
          ...content
        ],
        defaultStyle: {
          font: fontSettings.selectedFont,
          fontSize: fontSettings.normalTextSize,
        },
        styles: {
          header: {
            fontSize: fontSettings.titleSize,
            bold: true,
            color: fontSettings.titleColor,
            margin: [0, 0, 0, 20]
          }
        },
        pageSize: 'A4',
        pageMargins: [40, 60, 40, 60],
      };

      if (fontSettings.twoColumnLayout) {
        docDefinition.columns = 2;
      }

      const pdfDocGenerator = pdfMake.createPdf(docDefinition);
      pdfDocGenerator.getBlob((blob) => {
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        setIsGenerating(false);
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      setIsGenerating(false);
    }
  }, [markdown, title, fontSettings]);

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const saveDocument = useCallback(() => {
    const newDoc: PDFDocument = { id: Date.now().toString(), title, content: markdown };
    setDocuments([...documents, newDoc]);
    setCurrentDocument(newDoc);
  }, [title, markdown, documents, setDocuments, setCurrentDocument]);

  const downloadPDF = useCallback(() => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `${title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [pdfUrl, title]);

  return (
    <main className="flex-1 flex overflow-hidden">
      <div className="w-1/2 p-4 flex flex-col">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full mb-4 px-3 py-2 text-lg font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'
          }`}
          placeholder="Título del documento"
        />
        <textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          className={`flex-1 w-full p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'
          }`}
          placeholder="Escribe tu Markdown aquí..."
        />
        <div className="mt-4 flex justify-between">
          <button
            onClick={saveDocument}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Guardar Documento
          </button>
          <button
            onClick={generatePDF}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
          >
            Generar PDF
          </button>
          {pdfUrl && (
            <button
              onClick={downloadPDF}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Descargar PDF
            </button>
          )}
        </div>
      </div>
      <div className={`w-1/2 p-4 overflow-auto ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
        {isGenerating ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-xl font-semibold">Generando PDF...</p>
          </div>
        ) : pdfUrl ? (
          <iframe src={pdfUrl} className="w-full h-full rounded-md" />
        ) : (
          <div className="prose max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                h1: ({children}) => <h1 style={{fontSize: `${fontSettings.titleSize}px`, fontWeight: 'bold', color: fontSettings.titleColor}}>{children}</h1>,
                h2: ({children}) => <h2 style={{fontSize: `${fontSettings.subtitleSize}px`, fontWeight: 'bold', color: fontSettings.subtitleColor}}>{children}</h2>,
                h3: ({children}) => <h3 style={{fontSize: `${fontSettings.subsubtitleSize}px`, fontWeight: 'bold', color: fontSettings.subsubtitleColor}}>{children}</h3>,
                p: ({children}) => <p style={{fontSize: `${fontSettings.normalTextSize}px`, marginBottom: '10px'}}>{children}</p>,
              }}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </main>
  )
}