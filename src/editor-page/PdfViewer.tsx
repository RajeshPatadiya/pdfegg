import { useEffect, useState } from "react";
import { PdfHandle, PdfPageHandle } from "../pdf-rendering";
import PageContainer from "./PageContainer";
import PageSelector from "./PageSelector";

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

    if (!loadedPages.hasOwnProperty(pageNumber)) {
      loadPage();
    }
  }, [pdfHandle, pageNumber]);

  const pageHandle = loadedPages[pageNumber];

  return (
    <section className="pdf-viewer">
      <PageSelector
        selectedPageNumber={pageNumber}
        totalPageCount={pdfHandle.pageCount}
        onChanged={(pageNumber) => setPageNumber(pageNumber)}
      />

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
