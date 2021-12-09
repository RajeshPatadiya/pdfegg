import { useEffect, useRef, useState } from 'react';
import './App.css';
import renderPdf from './render/renderPdf';

function App() {
  const canvasRef = useRef();

  async function onFileChange(files) {
    if (files.length === 0) {
      console.log('Empty');
    } else {
      console.log(files[0]);
      const pdfBytes = await files[0].arrayBuffer();
      renderPdf(pdfBytes, canvasRef.current);
    }
  }

  return (
    <div className="App">
      <input
        type="file"
        name="pdf-input"
        accept=".pdf"
        onChange={(e) => onFileChange(e.target.files)}
      />
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

export default App;
