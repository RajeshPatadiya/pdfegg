import { PDFDocument } from 'pdf-lib';

async function generateModifiedPdf(pdfBytes, operation) {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();

    operation.applyOnPdfPage(pages[0]);

    return await pdfDoc.save();
}

export default generateModifiedPdf;