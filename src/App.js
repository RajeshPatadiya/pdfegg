import { useState, useEffect } from 'react';
import download from 'downloadjs';

import PdfRenderer from './pdf-renderer';
import PdfPage from './PdfPage';
import generateModifiedPdf from './generateModifiedPdf';
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
      <button
        disabled={pdfBytes === null}
        onClick={async (e) => {
          const outputBytes = await generateModifiedPdf(pdfBytes);
          download(outputBytes, 'example.pdf', 'application/pdf');
        }}
      >Download</button>
      <br />
      {pdfRenderer && <PdfViewer key={pdfRenderer.id} pdfRenderer={pdfRenderer} />}
    </div >
  );
}

function PdfViewer({ pdfRenderer }) {
  const [pageDimensions, setPageDimensions] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    async function updateDimensions() {
      console.log(`update dimensions for ${pageNumber}`);
      const dimensions = await pdfRenderer.getPageDimensions(pageNumber);
      setPageDimensions(dimensions);
    }
    updateDimensions();
  }, [pdfRenderer, pageNumber]);

  const hasPrev = pageNumber > 1;
  function prevPage() {
    if (hasPrev) {
      setPageNumber(p => p - 1);
      setPageDimensions(null);
    }
  }

  const hasNext = pageNumber < pdfRenderer.pageCount;
  function nextPage() {
    if (hasNext) {
      setPageNumber(p => p + 1);
      setPageDimensions(null);
    }
  }

  if (pageDimensions === null) return <p>Loading...</p>;

  const { width, height } = pageDimensions;
  const pageAspectRatio = width / height;

  return (
    <>
      <p>{pageNumber} / {pdfRenderer.pageCount}</p>
      <button disabled={!hasPrev} onClick={prevPage}>Prev</button>
      <button disabled={!hasNext} onClick={nextPage}>Next</button>
      <br />
      <PdfPage width="800" aspectRatio={pageAspectRatio} renderPage={pdfRenderer.renderPage.bind(pdfRenderer, pageNumber)} />
    </>
  );
}

export default App;
