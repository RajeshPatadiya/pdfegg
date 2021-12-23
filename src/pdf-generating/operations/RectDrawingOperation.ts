import { PDFPage } from "pdf-lib";
import Operation from "./Operation";
import { hexToPdfColor } from "./utils";

// Immutable object. Represents a single rect draw operation.
// All measurements are stored in PDF units.
class RectDrawingOperation extends Operation {
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
    color = "#ff0000",
    epoch = Date.now()
  ) {
    super(epoch);
    this.x = Math.round(x);
    this.y = Math.round(y);
    this.width = Math.round(width);
    this.height = Math.round(height);
    this.color = color;
  }

  applyOnPdfPage(pdfPage: PDFPage) {
    const { height: pageHeight } = pdfPage.getSize();

    pdfPage.drawRectangle({
      x: this.x,
      y: pageHeight - this.y - this.height,
      width: this.width,
      height: this.height,
      color: hexToPdfColor(this.color),
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

  getDisplayString() {
    return `Rect(${this.x}, ${this.y}, ${this.width}, ${this.height}, ${this.color})`;
  }

  copyWith({ color }: { color: string }): RectDrawingOperation {
    return new RectDrawingOperation(
      this.x,
      this.y,
      this.width,
      this.height,
      color || this.color,
      this.creationEpoch
    );
  }
}

export default RectDrawingOperation;
