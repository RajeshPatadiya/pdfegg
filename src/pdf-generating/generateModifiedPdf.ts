import { PDFDocument } from "pdf-lib";
import { DocumentOperations } from "../editor-page/DocumentOperationsContext";

async function generateModifiedPdf(
  pdfBytes: Uint8Array,
  documentOperations: DocumentOperations
) {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();

  console.log(documentOperations);

  for (const [key, operations] of Object.entries(documentOperations)) {
    const pageNum = Number(key);
    const page = pages[pageNum - 1];
    operations.forEach((op) => op.applyOnPdfPage(page));
  }

  return await pdfDoc.save();
}

export default generateModifiedPdf;
