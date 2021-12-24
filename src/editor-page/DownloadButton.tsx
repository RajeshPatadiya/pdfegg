import download from "downloadjs";
import generateModifiedPdf from "../pdf-generating/generateModifiedPdf";
import { useDocumentOperations } from "./DocumentOperationsContext";

function DownloadButton({ pdfBytes }: { pdfBytes: Uint8Array }) {
  const documentOperations = useDocumentOperations();

  async function downloadModifiedPdf() {
    const outputBytes = await generateModifiedPdf(
      pdfBytes,
      documentOperations.operationsPerPage
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
