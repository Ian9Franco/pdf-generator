import { Content, TDocumentDefinitions } from 'pdfmake/interfaces';

export function estimatePDFPages(content: Content[], docDefinition: TDocumentDefinitions): number {
  const contentLength = JSON.stringify(content).length;
  const pageSize = docDefinition.pageSize as { width: number; height: number };
  const pageArea = (pageSize.width - 80) * (pageSize.height - 120); // Subtracting margins
  const estimatedPages = Math.ceil(contentLength / (pageArea * 0.5)); // Assuming 50% of page is filled

  return estimatedPages;
}

export function adjustContentForSinglePage(content: Content[], docDefinition: TDocumentDefinitions): {
  content: Content[];
  titleSize: number;
  subtitleSize: number;
  subsubtitleSize: number;
  normalTextSize: number;
} {
  let titleSize = 18;
  let subtitleSize = 16;
  let subsubtitleSize = 14;
  let normalTextSize = 12;
  let lineSpacing = 1.2;

  while (estimatePDFPages(content, docDefinition) > 1 && normalTextSize > 8) {
    titleSize -= 0.5;
    subtitleSize -= 0.5;
    subsubtitleSize -= 0.5;
    normalTextSize -= 0.5;
    lineSpacing -= 0.05;

    content = content.map((item): Content => {
      if (typeof item === 'object' && item !== null && 'text' in item) {
        const textItem = item as Content & { text: string; fontSize?: number; margin?: number[] };
        if (textItem.fontSize === 18) textItem.fontSize = titleSize;
        else if (textItem.fontSize === 16) textItem.fontSize = subtitleSize;
        else if (textItem.fontSize === 14) textItem.fontSize = subsubtitleSize;
        else textItem.fontSize = normalTextSize;

        if (textItem.margin) {
          textItem.margin = textItem.margin.map((m: number) => Math.max(1, m - 1));
        }
      }
      return item;
    });

    docDefinition.defaultStyle = {
      ...docDefinition.defaultStyle,
      fontSize: normalTextSize,
      lineHeight: lineSpacing,
    };
  }

  return {
    content,
    titleSize,
    subtitleSize,
    subsubtitleSize,
    normalTextSize,
  };
}