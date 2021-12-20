import { useEffect, useState } from "react";
import { PdfHandle, PdfPageHandle } from "../pdf-rendering";
import PageContainer from "./PageContainer";

interface PdfViewerProps {
  pdfHandle: PdfHandle;
}

type LoadedPagesState = Record<number, PdfPageHandle>;

function PdfViewer({ pdfHandle }: PdfViewerProps) {
  const [pageNumber, setPageNumber] = useState(1);
  const [loadedPages, setLoadedPages] = useState<LoadedPagesState>({});

  useEffect(() => {
    async function loadPage() {
      console.log(`load page ${pageNumber}`);
      const pdfPageHandle = await pdfHandle.getPage(pageNumber);
      setLoadedPages((loadedPages) => {
        return { ...loadedPages, [pageNumber]: pdfPageHandle };
      });
    }
    loadPage();
  }, [pdfHandle, pageNumber]);

  const hasPrev = pageNumber > 1;
  function prevPage() {
    if (hasPrev) {
      setPageNumber((p) => p - 1);
    }
  }

  const hasNext = pageNumber < pdfHandle.pageCount;
  function nextPage() {
    if (hasNext) {
      setPageNumber((p) => p + 1);
    }
  }

  const pageHandle = loadedPages[pageNumber];

  return (
    <section className="pdf-viewer">
      <section className="pdf-viewer__nav">
        <p>
          {pageNumber} / {pdfHandle.pageCount}
        </p>
        <button disabled={!hasPrev} onClick={prevPage}>
          Prev
        </button>
        <button disabled={!hasNext} onClick={nextPage}>
          Next
        </button>
      </section>

      <section className="pdf-viewer__content">
        {pageHandle === undefined ? (
          <p>Loading...</p>
        ) : (
          <PageContainer width={800} pageHandle={pageHandle} />
        )}
      </section>
    </section>
  );
}

export default PdfViewer;
