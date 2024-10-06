import { Content, TDocumentDefinitions } from 'pdfmake/interfaces';

export interface PDFDocument {
  id: string;
  title: string;
  content: string;
}

export type PDFContent = Content[];

export type PDFDocDefinition = TDocumentDefinitions;