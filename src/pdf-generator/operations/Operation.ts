import { PDFPage } from "pdf-lib";

interface Operation {
  applyOnPdfPage: (pdfPage: PDFPage) => void;
  applyOnCanvas: (
    canvasContext: CanvasRenderingContext2D,
    pdfPageWidth: number
  ) => void;
}

export default Operation;
