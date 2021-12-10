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
      {pdfRenderer && <PdfViewer pdfRenderer={pdfRenderer} />}
    </div>
  );
}

function PdfViewer({ pdfRenderer }) {
  const [pageNumber, setPageNumber] = useState(1);

  const hasPrev = pageNumber > 1;
  function prevPage() {
    if (hasPrev) {
      setPageNumber(p => p - 1);
    }
  }

  const hasNext = pageNumber < pdfRenderer.pageCount;
  function nextPage() {
    if (hasNext) {
      setPageNumber(p => p + 1);
    }
  }

  return (
    <>
      <p>{pageNumber} / {pdfRenderer.pageCount}</p>
      <button disabled={!hasPrev} onClick={prevPage}>Prev</button>
      <button disabled={!hasNext} onClick={nextPage}>Next</button>
      <br />
      <PdfPage width="600" render={pdfRenderer.renderPage.bind(pdfRenderer, pageNumber)} />
    </>
  );
}

export default App;
