import { PDFDocument } from "pdf-lib";
import Drawable from "./drawables/Drawable";

async function generateModifiedPdf(
  pdfBytes: Uint8Array,
  drawables: {
    [pageNumber: number]: Drawable[];
  }
) {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();

  console.log(drawables);

  for (const [key, ds] of Object.entries(drawables)) {
    const pageNum = Number(key);
    const page = pages[pageNum - 1];
    ds.forEach((d) => d.drawOnPdfPage(page));
  }

  return await pdfDoc.save();
}

export default generateModifiedPdf;
