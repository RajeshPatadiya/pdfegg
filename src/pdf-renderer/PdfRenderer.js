import pdfjs from './pdfjsSetup';

export default class PdfRenderer {
    constructor() {
        this.pdf = null;
    }

    async load(pdfBytes) {
        const loadingTask = pdfjs.getDocument(pdfBytes);
        this.pdf = await loadingTask.promise;
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
        const renderTask = page.render({
            canvasContext: canvasContext,
            transform: null,
            viewport: viewport,
        });
        await renderTask.promise;
    }
}
