import pdfjs from "./pdfjsSetup";

export default async function renderPdf(pdfBytes, canvas) {
    const task = pdfjs.getDocument(pdfBytes);
    const pdf = await task.promise;
    const firstPage = await pdf.getPage(1);
    const viewport = firstPage.getViewport({ scale: 1 });
    const context = canvas.getContext('2d');

    firstPage.render({
        canvasContext: context,
        transform: null,
        viewport: viewport,
    });
}