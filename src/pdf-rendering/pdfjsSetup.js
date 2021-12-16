// Reference: https://github.com/wojtekmaj/react-pdf/blob/ca4453f123af51e2faed39a8a62800901030459a/src/entry.webpack.js

import * as pdfjs from "pdfjs-dist/legacy/build/pdf";

// eslint-disable-next-line
import pdfjsWorker from "file-loader!pdfjs-dist/legacy/build/pdf.worker";

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default pdfjs;
