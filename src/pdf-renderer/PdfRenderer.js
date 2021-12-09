import pdfjs from './pdfjsSetup';

export default class PdfRenderer {
    constructor() {
        this.pdf = null;
    }

    async load(pdfBytes) {
        const task = pdfjs.getDocument(pdfBytes);
        this.pdf = await task.promise;
    }

    async getPageDimensions(pageNum) {
        const page = await this.pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1 });
        return {
            width: viewport.width,
            height: viewport.height
        };
    }

    async renderPage(pageNum, canvasContext) {
        const page = await this.pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1 });
        page.render({
            canvasContext: canvasContext,
            transform: null,
            viewport: viewport,
        });
    }
}
