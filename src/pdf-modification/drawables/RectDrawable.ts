import { PDFPage } from "pdf-lib";
import Drawable from "./Drawable";
import { Box } from "./types";
import { hexToPdfColor } from "./utils";

class RectDrawable extends Drawable {
  readonly color: string;

  constructor(box: Box, color = "#ff0000", epoch = Date.now()) {
    super(epoch, box);
    this.color = color;
  }

  drawOnPdfPage(pdfPage: PDFPage) {
    const { height: pageHeight } = pdfPage.getSize();
    const { x, y, width, height } = this.box;

    pdfPage.drawRectangle({
      x,
      y: pageHeight - y - height,
      width,
      height,
      color: hexToPdfColor(this.color),
    });
  }

  drawOnCanvas(canvasContext: CanvasRenderingContext2D, pdfPageWidth: number) {
    const canvasWidth = canvasContext.canvas.width;
    const scaleToCanvas = (pdfUnits: number) =>
      (pdfUnits / pdfPageWidth) * canvasWidth;
    const { x, y, width, height } = this.box;

    canvasContext.fillStyle = this.color;
    canvasContext.fillRect(
      scaleToCanvas(x),
      scaleToCanvas(y),
      scaleToCanvas(width),
      scaleToCanvas(height)
    );
  }

  getDisplayString() {
    return "Rectangle";
  }

  copyWith({ color }: { color: string }): RectDrawable {
    return new RectDrawable(this.box, color || this.color, this.creationEpoch);
  }
}

export default RectDrawable;
