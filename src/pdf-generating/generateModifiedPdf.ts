import { PDFDocument } from "pdf-lib";
import Operation from "./operations/Operation";

async function generateModifiedPdf(
  pdfBytes: Uint8Array,
  operationsPerPage: {
    [pageNumber: number]: Operation[];
  }
) {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();

  console.log(operationsPerPage);

  for (const [key, operations] of Object.entries(operationsPerPage)) {
    const pageNum = Number(key);
    const page = pages[pageNum - 1];
    operations.forEach((op) => op.applyOnPdfPage(page));
  }

  return await pdfDoc.save();
}

export default generateModifiedPdf;
