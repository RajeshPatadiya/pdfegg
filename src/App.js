import { useState } from 'react';
import PdfRenderer from './pdf-renderer';
import PdfPage from './PdfPage';
import './App.css';

function App() {
  const [pdfRenderer, setPdfRenderer] = useState(null);

  async function onFileChange(files) {
    if (files.length === 0) return;

    const pdfBytes = await files[0].arrayBuffer();
    const pr = new PdfRenderer(window.devicePixelRatio);
    await pr.load(pdfBytes);

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
      <br />
      {pdfRenderer && <PdfPage width="600" render={pdfRenderer.renderPage.bind(pdfRenderer, 1)} />}
    </div>
  );
}

export default App;
