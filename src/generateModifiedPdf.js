import { PDFDocument, rgb } from 'pdf-lib';

async function generateModifiedPdf(pdfBytes, canvasX, canvasY, boxWidth, boxHeight) {
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();

    console.log([width, height]);
    console.log([canvasX, canvasY]);

    firstPage.drawRectangle({
        x: canvasX,
        y: height - canvasY - boxHeight,
        width: boxWidth,
        height: boxHeight,
        color: rgb(0, 0, 1),
    });

    return await pdfDoc.save();
}

export default generateModifiedPdf;