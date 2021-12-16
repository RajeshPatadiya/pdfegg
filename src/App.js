import { useState } from 'react';

import PdfHandle from './pdf-rendering';
import PdfViewer from './editor/PdfViewer';
import './App.css';
import { OperationsProvider, useOperations } from './editor/OperationsContext';
import generateModifiedPdf from './pdf-generator/generateModifiedPdf';
import download from 'downloadjs';

function App() {
  const [pdfHandle, setPdfHandle] = useState(null);

  async function onFileChange(files) {
    if (files.length === 0) return;

    const pdfBytes = await files[0].arrayBuffer();
    const newPdfHandle = await PdfHandle.create(pdfBytes);
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
        <DownloadButton pdfBytes={pdfHandle.bytes} />
        <br />
        {pdfHandle && <PdfViewer key={pdfHandle.id} pdfHandle={pdfHandle} />}
      </OperationsProvider>
    </div >
  );
}

function DownloadButton({ pdfBytes }) {
  const operations = useOperations();

  async function downloadModifiedPdf() {
    const outputBytes = await generateModifiedPdf(pdfBytes, operations);
    download(outputBytes, 'example.pdf', 'application/pdf');
  }

  return (
    <button
      disabled={pdfBytes === null}
      onClick={() => downloadModifiedPdf()}
    >Download</button>
  );
}

export default App;
