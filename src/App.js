import { useEffect, useRef, useState } from 'react';
import './App.css';
import PdfRenderer from './pdf-renderer';

function App() {
  const [dimensions, setDimensions] = useState({ width: 100, height: 100 });
  const canvasRef = useRef();

  async function onFileChange(files) {
    if (files.length === 0) {
      console.log('Empty');
    } else {
      console.log(files[0]);
      const pdfBytes = await files[0].arrayBuffer();
      // renderPdf(pdfBytes, canvasRef.current);
      const r = new PdfRenderer();
      await r.load(pdfBytes);
      setDimensions(await r.getPageDimensions(1));
      r.renderPage(1, canvasRef.current.getContext('2d'));
    }
  }

  const { width, height } = dimensions;

  return (
    <div className="App">
      <input
        type="file"
        name="pdf-input"
        accept=".pdf"
        onChange={(e) => onFileChange(e.target.files)}
      />
      <br />
      <canvas ref={canvasRef} width={width} height={height} />
    </div>
  );
}

export default App;
