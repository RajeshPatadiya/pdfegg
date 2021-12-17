/* eslint-disable import/no-webpack-loader-syntax */
// Reference: https://github.com/mozilla/pdf.js/issues/12379#issuecomment-692804601

// We need to get the url of the worker (we use min for prod)
// @ts-ignore
import workerSrc from "!!file-loader!pdfjs-dist/build/pdf.worker.min.js";

// Use require because import doesn't work for some obscure reason. Also use `webpackChunkName` so it will not bundle this huge lib in your main code
const pdfjs: typeof import("pdfjs-dist") = require(/* webpackChunkName: "pdfjs-dist" */ `pdfjs-dist`);

// Now you assign the worker file path to the `pdfjs` (yes, it's that cumbersome)
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

export default pdfjs;
