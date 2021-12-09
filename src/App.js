import { useState } from 'react';
import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import download from 'downloadjs';
import './App.css';

async function modifyPdf(file) {
  const existingPdfBytes = await file.arrayBuffer()

  const pdfDoc = await PDFDocument.load(existingPdfBytes)
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const pages = pdfDoc.getPages()
  const firstPage = pages[0]
  const { width, height } = firstPage.getSize()
  firstPage.drawText('This text was added with JavaScript!', {
    x: 5,
    y: height / 2 + 300,
    size: 50,
    font: helveticaFont,
    color: rgb(0.95, 0.1, 0.1),
    rotate: degrees(-45),
  })

  const pdfBytes = await pdfDoc.save()
  // download(pdfBytes, 'example.pdf', 'application/pdf');

  var blob = new Blob([pdfBytes], { type: "application/pdf" });
  var link = window.URL.createObjectURL(blob);

  return link;
}

function App() {
  const [state, setState] = useState('');

  async function onFileChange(files) {
    if (files.length === 0) {
      console.log('Empty');
    } else {
      console.log(files[0]);
      const link = await modifyPdf(files[0]);
      setState(link);
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
      <iframe
        src="https://example.org"
        title="iframe Example 1"
        width="400"
        height="300"
      />
      <iframe src={state} type="application/pdf" width="800" height="800" />
    </div>
  );
}

export default App;
