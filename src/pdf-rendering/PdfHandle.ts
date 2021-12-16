import { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";
import pdfjs from "./pdfjsSetup";
import PdfPageHandle from "./PdfPageHandle";

class PdfHandle {
  readonly bytes: Uint8Array;
  readonly id: string;
  private pdfjsDocument;

  private constructor(
    pdfBytes: Uint8Array,
    id: string,
    pdfjsDocument: PDFDocumentProxy
  ) {
    this.bytes = pdfBytes;
    this.id = id;
    this.pdfjsDocument = pdfjsDocument;
  }

  static async create(pdfBytes: Uint8Array) {
    const loadingTask = pdfjs.getDocument(pdfBytes);
    const id = loadingTask.docId;
    const pdfjsDocument = await loadingTask.promise;
    return new PdfHandle(pdfBytes, id, pdfjsDocument);
  }

  get pageCount() {
    return this.pdfjsDocument.numPages;
  }

  async getPage(pageNum: number) {
    const pdfjsPage = await this.pdfjsDocument.getPage(pageNum);
    return new PdfPageHandle(pdfjsPage);
  }

  // TODO: Implement
  async releaseResources() {}
}

export default PdfHandle;
