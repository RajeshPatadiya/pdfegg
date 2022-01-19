import download from "downloadjs";
import generateModifiedPdf from "../write-pdf/generateModifiedPdf";
import { useDocumentOperations } from "./DocumentOperationsContext";

function DownloadButton({ pdfBytes }: { pdfBytes: Uint8Array }) {
  const documentOperations = useDocumentOperations();

  async function downloadModifiedPdf() {
    const outputBytes = await generateModifiedPdf(
      pdfBytes,
      documentOperations.drawablesOnPage
    );
    download(outputBytes, "example.pdf", "application/pdf");
  }

  return (
    <button disabled={pdfBytes === null} onClick={() => downloadModifiedPdf()}>
      Download
    </button>
  );
}

export default DownloadButton;
