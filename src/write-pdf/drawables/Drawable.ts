import { PDFPage } from "pdf-lib";
import { Box } from "../../common/logic";

// Immutable drawable object.
// Can be drawn both on canvas and PDF page.
// All measurements are stored in PDF units.
abstract class Drawable {
  readonly creationEpoch: number;
  readonly box: Box;

  constructor(creationEpoch: number, box: Box) {
    this.creationEpoch = creationEpoch;
    this.box = box;
  }

  abstract drawOnPdfPage(pdfPage: PDFPage): void;

  abstract drawOnCanvas(
    canvasContext: CanvasRenderingContext2D,
    pdfPageWidth: number
  ): void;

  abstract getDisplayString(): string;

  abstract copyWith({}): Drawable;
}

export default Drawable;
