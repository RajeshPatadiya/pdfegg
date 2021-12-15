import pdfjs from './pdfjsSetup';

export class PdfHandle {
    #bytes;
    #id;
    #pdfjsDocument;

    // TODO: Make this constructor private when migrating to TypeScript
    constructor(pdfBytes, id, pdfjsDocument) {
        this.#bytes = pdfBytes;
        this.#id = id;
        this.#pdfjsDocument = pdfjsDocument;
    }

    static async create(pdfBytes) {
        const loadingTask = pdfjs.getDocument(pdfBytes);
        const id = loadingTask.docId;
        const pdfjsDocument = await loadingTask.promise;
        return new PdfHandle(pdfBytes, id, pdfjsDocument);
    }

    get bytes() {
        return this.#bytes;
    }

    get id() {
        return this.#id;
    }

    get pageCount() {
        return this.#pdfjsDocument.numPages;
    }

    async getPage(pageNum) {
        const pdfjsPage = await this.#pdfjsDocument.getPage(pageNum);
        return new PdfPageHandle(pdfjsPage);
    }

    // TODO: Implement
    async releaseResources() { }
}

export class PdfPageHandle {
    #pdfjsPage;
    #width;
    #height;

    constructor(pdfjsPage) {
        this.#pdfjsPage = pdfjsPage;
        const viewport = pdfjsPage.getViewport({ scale: 1 });
        this.#width = viewport.width;
        this.#height = viewport.height;
    }

    get width() {
        return this.#width;
    }

    get height() {
        return this.#height;
    }

    async render(canvasContext) {
        console.log('render page');
        const scale = canvasContext.canvas.width / this.#width;
        const scaledViewport = this.#pdfjsPage.getViewport({ scale: scale });

        const renderTask = this.#pdfjsPage.render({
            canvasContext: canvasContext,
            transform: null,
            viewport: scaledViewport,
        });
        await renderTask.promise;
    }

    // TODO: Implement
    async releaseResources() { }
}
