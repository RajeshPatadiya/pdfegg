import { useState } from 'react';

import PdfRenderer from './pdf-renderer';
import PdfViewer from './editor/PdfViewer';
import './App.css';

function App() {
  const [pdfBytes, setPdfBytes] = useState(null);
  const [pdfRenderer, setPdfRenderer] = useState(null);

  async function onFileChange(files) {
    if (files.length === 0) return;

    const pdfBytes = await files[0].arrayBuffer();
    const pr = new PdfRenderer();
    await pr.load(pdfBytes);

    setPdfBytes(pdfBytes);
    setPdfRenderer(pr);
  }

  return (
    <div className="App">
      <input
        type="file"
        name="pdf-input"
        accept=".pdf"
        onChange={(e) => onFileChange(e.target.files)}
      />
      {/* <button
          disabled={pdfBytes === null}
          onClick={async (e) => {
            const outputBytes = await generateModifiedPdf(pdfBytes, boxState.operation);
            download(outputBytes, 'example.pdf', 'application/pdf');
          }}
        >Download</button> */}
      <br />
      {pdfRenderer && <PdfViewer key={pdfRenderer.id} pdfRenderer={pdfRenderer} />}
    </div >
  );
}

export default App;
