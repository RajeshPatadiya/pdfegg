import { useState } from "react";

import { PdfHandle } from "./pdf-rendering";
import PdfViewer from "./editor/PdfViewer";
import "./App.css";
import { OperationsProvider, useOperations } from "./editor/OperationsContext";
import generateModifiedPdf from "./pdf-generator/generateModifiedPdf";
import download from "downloadjs";

function App() {
  const [pdfHandle, setPdfHandle] = useState<PdfHandle | null>(null);

  async function onFileChange(files: FileList | null) {
    if (files === null || files.length === 0) return;

    const buffer = await files[0].arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const newPdfHandle = await PdfHandle.create(bytes);
    setPdfHandle(newPdfHandle);
  }

  return (
    <div className="App">
      <input
        type="file"
        name="pdf-input"
        accept=".pdf"
        onChange={(e) => onFileChange(e.target.files)}
      />
      <OperationsProvider>
        {pdfHandle && <DownloadButton pdfBytes={pdfHandle.bytes} />}
        {/* TODO: Use proper layout */}
        <br />
        {pdfHandle && <PdfViewer key={pdfHandle.id} pdfHandle={pdfHandle} />}
      </OperationsProvider>
    </div>
  );
}

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

export default App;
