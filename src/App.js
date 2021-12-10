import { useRef } from 'react';
import PdfRenderer from './pdf-renderer';
import './App.css';

function App() {
  const canvasRef = useRef();

  async function onFileChange(files) {
    if (files.length === 0) return;

    const pdfBytes = await files[0].arrayBuffer();

    const pr = new PdfRenderer();
    await pr.load(pdfBytes);

    const firstPageDimensions = await pr.getPageDimensions(1);
    const { width, height } = firstPageDimensions;

    canvasRef.current.width = width;
    canvasRef.current.height = height;

    const canvasContext = canvasRef.current.getContext('2d');
    await pr.renderPage(1, canvasContext);
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
      <canvas
        ref={canvasRef}
      // width={width}
      // height={height}
      />
    </div>
  );
}

export default App;
