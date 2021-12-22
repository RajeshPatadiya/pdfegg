import { PDFPage } from "pdf-lib";

abstract class Operation {
  creationEpoch: number;

  constructor(creationEpoch: number) {
    this.creationEpoch = creationEpoch;
  }

  abstract applyOnPdfPage(pdfPage: PDFPage): void;

  abstract applyOnCanvas(
    canvasContext: CanvasRenderingContext2D,
    pdfPageWidth: number
  ): void;

  abstract getDisplayString(): string;
}

export default Operation;
