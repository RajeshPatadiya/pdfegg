import { rgb } from "pdf-lib";

// Immutable object. Represents a single rect draw operation.
// All measurements are stored in PDF units.
class RectDrawingOperation {
  constructor(x, y, width, height, color = "blue") {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  applyOnPdfPage(pdfPage) {
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

  applyOnCanvas(canvasContext, pdfPageWidth) {
    const canvasWidth = canvasContext.canvas.width;
    const scaleToCanvas = (pdfUnits) => (pdfUnits / pdfPageWidth) * canvasWidth;

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
