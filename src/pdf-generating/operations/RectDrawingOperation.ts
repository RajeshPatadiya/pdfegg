import { PDFPage, rgb } from "pdf-lib";
import Operation from "./Operation";

// Immutable object. Represents a single rect draw operation.
// All measurements are stored in PDF units.
class RectDrawingOperation implements Operation {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly color: string;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    color = "blue"
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  applyOnPdfPage(pdfPage: PDFPage) {
    const { height: pageHeight } = pdfPage.getSize();

    pdfPage.drawRectangle({
      x: this.x,
      y: pageHeight - this.y - this.height,
      width: this.width,
      height: this.height,
      // TODO: Convert color
      color: rgb(0, 0, 1),
    });
  }

  applyOnCanvas(canvasContext: CanvasRenderingContext2D, pdfPageWidth: number) {
    const canvasWidth = canvasContext.canvas.width;
    const scaleToCanvas = (pdfUnits: number) =>
      (pdfUnits / pdfPageWidth) * canvasWidth;

    canvasContext.fillStyle = this.color;
    canvasContext.fillRect(
      scaleToCanvas(this.x),
      scaleToCanvas(this.y),
      scaleToCanvas(this.width),
      scaleToCanvas(this.height)
    );
  }
}

export default RectDrawingOperation;
