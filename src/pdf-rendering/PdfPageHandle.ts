import { PDFPageProxy } from "pdfjs-dist/types/src/display/api";

class PdfPageHandle {
  readonly width: number;
  readonly height: number;
  private pdfjsPage: PDFPageProxy;

  constructor(pdfjsPage: PDFPageProxy) {
    this.pdfjsPage = pdfjsPage;
    const viewport = pdfjsPage.getViewport({ scale: 1 });
    this.width = viewport.width;
    this.height = viewport.height;
  }

  async render(canvasContext: CanvasRenderingContext2D) {
    console.log("render page");
    const scale = canvasContext.canvas.width / this.width;
    const scaledViewport = this.pdfjsPage.getViewport({ scale: scale });

    const renderTask = this.pdfjsPage.render({
      canvasContext: canvasContext,
      viewport: scaledViewport,
    });
    await renderTask.promise;
  }

  // TODO: Implement
  async releaseResources() {}
}

export default PdfPageHandle;
