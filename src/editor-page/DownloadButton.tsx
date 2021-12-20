import download from "downloadjs";
import generateModifiedPdf from "../pdf-generating/generateModifiedPdf";
import { useOperations } from "./OperationsContext";

function DownloadButton({ pdfBytes }: { pdfBytes: Uint8Array }) {
  const operations = useOperations();

  async function downloadModifiedPdf() {
    const outputBytes = await generateModifiedPdf(pdfBytes, operations);
    download(outputBytes, "example.pdf", "application/pdf");
  }

  return (
    <button disabled={pdfBytes === null} onClick={() => downloadModifiedPdf()}>
      Download
    </button>
  );
}

export default DownloadButton;
