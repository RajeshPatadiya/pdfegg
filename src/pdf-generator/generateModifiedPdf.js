import { PDFDocument } from "pdf-lib";

async function generateModifiedPdf(pdfBytes, operations) {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();

  operations.forEach((op) => op.applyOnPdfPage(pages[0]));

  return await pdfDoc.save();
}

export default generateModifiedPdf;
