
// This tells TypeScript that pdfjsLib is available on the global window object.
declare const pdfjsLib: any;

/**
 * Extracts text content from all pages of a PDF file.
 * @param file The PDF file to process.
 * @returns A promise that resolves to a single string containing all the text from the PDF.
 */
export const extractTextFromPdf = async (file: File): Promise<string> => {
  if (typeof pdfjsLib === 'undefined') {
    console.error("pdf.js library is not loaded.");
    throw new Error("PDF processing library is not available. Please check your internet connection.");
  }

  const arrayBuffer = await file.arrayBuffer();

  // Load the PDF document
  const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
  const numPages = pdf.numPages;
  const allText: string[] = [];

  // Iterate through each page
  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(' ');
    allText.push(pageText);
  }

  return allText.join('\n\n');
};
