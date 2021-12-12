import { useState, useEffect, useCallback } from 'react';
import download from 'downloadjs';

import PdfRenderer from './pdf-renderer';
import generateModifiedPdf from './generateModifiedPdf';
import './App.css';
import HighDpiCanvas from './common/HighDpiCanvas';

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

function PdfViewer({ pdfBytes, pdfRenderer }) {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

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

  const renderPage = useCallback(
    (canvasContext) => {
      pdfRenderer.renderPage(pageNumber, canvasContext);
    },
    [pdfRenderer, pageNumber],
  );

  const renderBox = useCallback(
    (context) => {
      const { width } = pageDimensions;
      const _x = pdfToCanvasUnits(x, width, context.canvas.width);
      const _y = pdfToCanvasUnits(y, width, context.canvas.width);
      const size = pdfToCanvasUnits(100, width, context.canvas.width);
      context.fillStyle = 'blue';
      context.fillRect(_x, _y, size, size);
    },
    [x, y, pageDimensions],
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
      <input type="number" value={x} onChange={e => setX(Number(e.target.value))} />
      <input type="number" value={y} onChange={e => setY(Number(e.target.value))} />
      <button
        disabled={pdfBytes === null}
        onClick={async (e) => {
          const outputBytes = await generateModifiedPdf(pdfBytes, x, y);
          download(outputBytes, 'example.pdf', 'application/pdf');
        }}
      >Download</button>
      <br />
      <div className="page-container" style={containerStyle}>
        <HighDpiCanvas
          width={containerWidth}
          height={containerHeight}
          render={renderPage}
        />
        <HighDpiCanvas
          width={containerWidth}
          height={containerHeight}
          render={renderBox}
          onClick={e => {
            const canvas = e.target;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            setX(canvasToPdfUnits(x, width, containerWidth));
            setY(canvasToPdfUnits(y, width, containerWidth));
          }}
        />
      </div>
    </>
  );
}

function pdfToCanvasUnits(pdfUnits, pdfWidth, canvasWidth) {
  return pdfUnits / pdfWidth * canvasWidth;
}

function canvasToPdfUnits(canvasUnits, pdfWidth, canvasWidth) {
  return canvasUnits / canvasWidth * pdfWidth;
}

export default App;
