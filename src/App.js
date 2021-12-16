import { useState } from 'react';

import PdfHandle from './pdf-rendering';
import PdfViewer from './editor/PdfViewer';
import './App.css';
import { OperationsProvider } from './editor/OperationsContext';

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
        {/* <button
          disabled={pdfBytes === null}
          onClick={async (e) => {
            const outputBytes = await generateModifiedPdf(pdfBytes, boxState.operation);
            download(outputBytes, 'example.pdf', 'application/pdf');
          }}
        >Download</button> */}
        <br />
        {pdfHandle && <PdfViewer key={pdfHandle.id} pdfHandle={pdfHandle} />}
      </OperationsProvider>
    </div >
  );
}

export default App;
