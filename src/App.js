import { useState, useEffect, useCallback, useReducer } from 'react';
import download from 'downloadjs';

import PdfRenderer from './pdf-renderer';
import generateModifiedPdf from './pdf-generator/generateModifiedPdf';
import './App.css';
import HighDpiCanvas from './common/HighDpiCanvas';
import RectDrawingOperation from './pdf-generator/operations/RectDrawingOperation';
import PdfPageCanvas from './editor/PdfPageCanvas';

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
      <br />
      {pdfRenderer && <PdfViewer key={pdfRenderer.id} pdfBytes={pdfBytes} pdfRenderer={pdfRenderer} />}
    </div >
  );
}

function PdfViewer({ pdfRenderer }) {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageDimensions, setPageDimensions] = useState(null);

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

  const renderPage = useCallback(
    (canvasContext) => {
      pdfRenderer.renderPage(pageNumber, canvasContext);
    },
    [pdfRenderer, pageNumber],
  );

  if (pageDimensions === null) return <p>Loading...</p>;

  const { width, height } = pageDimensions;
  const pageAspectRatio = width / height;

  const containerWidth = 800;
  const containerHeight = containerWidth / pageAspectRatio;
  const containerStyle = { width: `${containerWidth}px`, height: `${containerHeight}px` };

  return (
    <>
      <p>{pageNumber} / {pdfRenderer.pageCount}</p>
      <button disabled={!hasPrev} onClick={prevPage}>Prev</button>
      <button disabled={!hasNext} onClick={nextPage}>Next</button>
      {/* <button
        disabled={pdfBytes === null}
        onClick={async (e) => {
          const outputBytes = await generateModifiedPdf(pdfBytes, boxState.operation);
          download(outputBytes, 'example.pdf', 'application/pdf');
        }}
      >Download</button> */}
      <br />
      <div className="page-container" style={containerStyle}>
        <HighDpiCanvas
          width={containerWidth}
          height={containerHeight}
          render={renderPage}
        />
        <PdfPageCanvas
          width={containerWidth}
          height={containerHeight}
          pdfPageWidth={width}
        />
      </div>
    </>
  );
}

export default App;
