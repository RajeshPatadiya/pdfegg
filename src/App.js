import { useState, useEffect, useCallback, useReducer } from 'react';
import download from 'downloadjs';

import PdfRenderer from './pdf-renderer';
import generateModifiedPdf from './pdf-generator/generateModifiedPdf';
import './App.css';
import HighDpiCanvas from './common/HighDpiCanvas';
import RectDrawingOperation from './pdf-generator/operations/RectDrawingOperation';

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
  const [boxState, dispatchBoxEvent] = useReducer(boxReducer, initialBoxState);

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
      const { operation } = boxState;
      if (operation === null) return;

      const { width: pdfPageWidth } = pageDimensions;
      operation.applyOnCanvas(context, pdfPageWidth);
    },
    [boxState, pageDimensions],
  );

  if (pageDimensions === null) return <p>Loading...</p>;

  const { width, height } = pageDimensions;
  const pageAspectRatio = width / height;

  const containerWidth = 800;
  const containerHeight = containerWidth / pageAspectRatio;
  const containerStyle = { width: `${containerWidth}px`, height: `${containerHeight}px` };

  const getMouseCoords = (e) => {
    const canvas = e.target;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  };

  const getPdfCoords = (e) => {
    const { x, y } = getMouseCoords(e);
    return {
      x: scaleContainerToPdfUnits(x),
      y: scaleContainerToPdfUnits(y),
    }
  }

  const scaleContainerToPdfUnits = (containerUnits) => containerUnits / containerWidth * width;

  return (
    <>
      <p>{pageNumber} / {pdfRenderer.pageCount}</p>
      <button disabled={!hasPrev} onClick={prevPage}>Prev</button>
      <button disabled={!hasNext} onClick={nextPage}>Next</button>
      {/* <input type="number" value={x} onChange={e => setX(Number(e.target.value))} />
      <input type="number" value={y} onChange={e => setY(Number(e.target.value))} />
      <input type="number" value={boxWidth} onChange={e => setBoxWidth(Number(e.target.value))} />
      <input type="number" value={boxHeight} onChange={e => setBoxHeight(Number(e.target.value))} /> */}
      <button
        disabled={pdfBytes === null}
        onClick={async (e) => {
          const outputBytes = await generateModifiedPdf(pdfBytes, boxState.operation);
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
          onMouseDown={e => {
            const { x, y } = getPdfCoords(e);
            dispatchBoxEvent({ type: 'DRAG_START', x, y });
          }}
          onMouseMove={e => {
            const { x, y } = getPdfCoords(e);
            dispatchBoxEvent({ type: 'DRAG_UPDATE', x, y });
          }}
          onMouseUp={e => {
            dispatchBoxEvent({ type: 'DRAG_END' });
          }}
          onMouseLeave={e => {
            dispatchBoxEvent({ type: 'DRAG_END' });
          }}
        />
      </div>
    </>
  );
}

const initialBoxState = { dragging: false, operation: null };

function boxReducer(state, action) {
  const { dragging, operation } = state;
  const { type, x, y } = action;

  switch (type) {
    case 'DRAG_START':
      return {
        dragging: true,
        operation: new RectDrawingOperation(x, y, 0, 0)
      };
    case 'DRAG_UPDATE':
      if (!dragging) return state;
      const width = x - operation.x;
      const height = y - operation.y;
      return {
        dragging,
        operation: new RectDrawingOperation(operation.x, operation.y, width, height),
      };
    case 'DRAG_END':
      return {
        dragging: false,
        operation
      };
    default:
      throw new Error();
  }
}

export default App;
