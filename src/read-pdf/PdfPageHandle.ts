import { PDFPageProxy } from "pdfjs-dist/types/src/display/api";
import { Size, sizeAspectRatio } from "../common/Measure";

class PdfPageHandle {
  readonly size: Size;
  private pdfjsPage: PDFPageProxy;

  constructor(pdfjsPage: PDFPageProxy) {
    this.pdfjsPage = pdfjsPage;
    const viewport = pdfjsPage.getViewport({ scale: 1 });
    this.size = {
      width: viewport.width,
      height: viewport.height,
    };
  }

  get aspectRatio(): number {
    return sizeAspectRatio(this.size);
  }

  async render(canvasContext: CanvasRenderingContext2D) {
    console.log("render page");
    const scale = canvasContext.canvas.width / this.size.width;
    const scaledViewport = this.pdfjsPage.getViewport({ scale: scale });

    const renderTask = this.pdfjsPage.render({
      canvasContext: canvasContext,
      viewport: scaledViewport,
    });
    await renderTask.promise;
  }

  async releaseResources() {
    this.pdfjsPage.cleanup();
  }
}

export default PdfPageHandle;
