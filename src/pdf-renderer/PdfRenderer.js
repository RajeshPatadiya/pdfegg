import pdfjs from './pdfjsSetup';

export default class PdfRenderer {
    constructor(devicePixelRatio) {
        this.pdf = null;
        this.devicePixelRatio = devicePixelRatio || 1;
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

    async renderPage(pageNum, canvas) {
        const page = await this.pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1 });
        const aspectRatio = viewport.width / viewport.height;

        const containerWidth = parseFloat(canvas.style.width);
        const containerHeight = containerWidth / aspectRatio;

        const dpr = this.devicePixelRatio;
        canvas.width = containerWidth * dpr;
        canvas.height = containerHeight * dpr;

        const scale = containerWidth / viewport.width;
        const scaledViewport = page.getViewport({ scale: scale });

        const transform = dpr !== 1
            ? [dpr, 0, 0, dpr, 0, 0]
            : null;

        const canvasContext = canvas.getContext('2d');
        const renderTask = page.render({
            canvasContext: canvasContext,
            transform: transform,
            viewport: scaledViewport,
        });
        await renderTask.promise;
    }
}
