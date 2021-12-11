import pdfjs from './pdfjsSetup';

export default class PdfRenderer {
    #pdf;
    #id;

    constructor() {
        this.#pdf = null;
    }

    async load(pdfBytes) {
        const loadingTask = pdfjs.getDocument(pdfBytes);
        this.#pdf = await loadingTask.promise;
        this.#id = loadingTask.docId;
    }

    get id() {
        return this.#id;
    }

    get pageCount() {
        return this.#pdf.numPages;
    }

    async getPageDimensions(pageNum) {
        const page = await this.#pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1 });
        return {
            width: viewport.width,
            height: viewport.height
        };
    }

    async renderPage(pageNum, canvasContext) {
        const page = await this.#pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1 });

        const scale = canvasContext.canvas.width / viewport.width;
        const scaledViewport = page.getViewport({ scale: scale });

        const renderTask = page.render({
            canvasContext: canvasContext,
            transform: null,
            viewport: scaledViewport,
        });
        await renderTask.promise;
    }
}
