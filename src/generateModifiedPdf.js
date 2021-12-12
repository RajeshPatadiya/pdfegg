import { PDFDocument, rgb } from 'pdf-lib';

async function generateModifiedPdf(pdfBytes, canvasX, canvasY) {
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();

    console.log([width, height]);

    firstPage.drawRectangle({
        x: canvasX,
        y: height - canvasY,
        width: 100,
        height: 100,
        color: rgb(0.1, 0.95, 0.1),
    });

    return await pdfDoc.save();
}

export default generateModifiedPdf;