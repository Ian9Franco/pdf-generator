import React, { useState, useCallback, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { PDFDocument, PDFContent, PDFDocDefinition } from '../types'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import htmlToPdfmake from 'html-to-pdfmake'
import { adjustContentForSinglePage } from '../utils/pdfUtils'
import { availableFonts } from '../fonts'

pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
  setFontSettings: React.Dispatch<React.SetStateAction<MainContentProps['fontSettings']>>;
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
  setFontSettings,
}: MainContentProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const generatePDF = useCallback(async () => {
    setIsGenerating(true);
    setShowPreview(true);
    try {
      // Convert Markdown to HTML
      const htmlContent = await new Promise<string>((resolve) => {
        const result = ReactMarkdown({
          children: markdown,
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeRaw],
          components: {
            h1: ({children}) => <h1 style={{fontSize: `${fontSettings.titleSize}px`, fontWeight: 'bold', color: fontSettings.titleColor, fontFamily: fontSettings.selectedFont}}>{children}</h1>,
            h2: ({children}) => <h2 style={{fontSize: `${fontSettings.subtitleSize}px`, fontWeight: 'bold', color: fontSettings.subtitleColor, fontFamily: fontSettings.selectedFont}}>{children}</h2>,
            h3: ({children}) => <h3 style={{fontSize: `${fontSettings.subsubtitleSize}px`, fontWeight: 'bold', color: fontSettings.subsubtitleColor, fontFamily: fontSettings.selectedFont}}>{children}</h3>,
            p: ({children}) => <p style={{fontSize: `${fontSettings.normalTextSize}px`, marginBottom: '10px', fontFamily: fontSettings.selectedFont}}>{children}</p>,
            span: ({children}) => <span style={{fontFamily: fontSettings.selectedFont}}>{children}</span>,
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

      const docDefinition: PDFDocDefinition = {
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
        (docDefinition as PDFDocDefinition & { columns?: number }).columns = 2;
      }

      // Adjust content to fit on a single page
      const { content: adjustedContent, titleSize, subtitleSize, subsubtitleSize, normalTextSize } = 
        adjustContentForSinglePage(docDefinition.content as PDFContent, docDefinition);

      docDefinition.content = adjustedContent;
      setFontSettings(prev => ({
        ...prev,
        titleSize,
        subtitleSize,
        subsubtitleSize,
        normalTextSize
      }));

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
  }, [markdown, title, fontSettings, setFontSettings]);

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

  useEffect(() => {
    generatePDF();
  }, [generatePDF]);

  const selectedFontVariable = availableFonts.find(font => font.name === fontSettings.selectedFont)?.variable || '--font-open-sans';

  return (
    <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
      <div className="w-full md:w-1/2 p-4 flex flex-col">
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
          style={{ fontFamily: `var(${selectedFontVariable})` }}
        />
        <div className="mt-4 flex flex-wrap justify-between gap-2">
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
          <button
            onClick={downloadPDF}
            disabled={!pdfUrl}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Descargar PDF
          </button>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="md:hidden px-4 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors"
          >
            {showPreview ? 'Ocultar Vista Previa' : 'Mostrar Vista Previa'}
          </button>
        </div>
      </div>
      <div className={`w-full md:w-1/2 p-4 overflow-auto ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} ${showPreview ? '' : 'hidden md:block'} border-2 border-primary shadow-lg rounded-lg`}>
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
                h1: ({children}) => <h1 style={{fontSize: `${fontSettings.titleSize}px`, fontWeight: 'bold', color: fontSettings.titleColor, fontFamily: `var(${selectedFontVariable})`}}>{children}</h1>,
                h2: ({children}) => <h2 style={{fontSize: `${fontSettings.subtitleSize}px`, fontWeight: 'bold', color: fontSettings.subtitleColor, fontFamily: `var(${selectedFontVariable})`}}>{children}</h2>,
                h3: ({children}) => <h3 style={{fontSize: `${fontSettings.subsubtitleSize}px`, fontWeight: 'bold', color: fontSettings.subsubtitleColor, fontFamily: `var(${selectedFontVariable})`}}>{children}</h3>,
                p: ({children}) => <p style={{fontSize: `${fontSettings.normalTextSize}px`, marginBottom: '10px', fontFamily: `var(${selectedFontVariable})`}}>{children}</p>,
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