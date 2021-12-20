import { PDFDocument } from "pdf-lib";
import Operation from "./operations/Operation";

async function generateModifiedPdf(
  pdfBytes: Uint8Array,
  operations: Operation[]
) {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();

  operations.forEach((op) => op.applyOnPdfPage(pages[0]));

  return await pdfDoc.save();
}

export default generateModifiedPdf;
