import { useState } from "react";
import { OperationsProvider } from "./OperationsContext";
import { PdfHandle } from "../pdf-rendering";
import DownloadButton from "./DownloadButton";
import PdfViewer from "./PdfViewer";

import "./EditorPage.css";
import Header from "./Header";

function EditorPage() {
  const [pdfHandle, setPdfHandle] = useState<PdfHandle | null>(null);

  async function onFileChange(files: FileList | null) {
    if (files === null || files.length === 0) return;

    const buffer = await files[0].arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const newPdfHandle = await PdfHandle.create(bytes);
    setPdfHandle(newPdfHandle);
  }

  return (
    <>
      <OperationsProvider>
        <Header>
          <h1>pdfegg</h1>
          <input
            type="file"
            name="pdf-input"
            accept=".pdf"
            onChange={(e) => onFileChange(e.target.files)}
          />
          {pdfHandle && <DownloadButton pdfBytes={pdfHandle.bytes} />}
        </Header>

        {pdfHandle && <PdfViewer key={pdfHandle.id} pdfHandle={pdfHandle} />}
      </OperationsProvider>
    </>
  );
}

export default EditorPage;
