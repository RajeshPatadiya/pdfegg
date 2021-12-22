import { useEffect, useState } from "react";
import { PdfHandle, PdfPageHandle } from "../pdf-rendering";
import {
  useDocumentOperations,
  useDocumentOperationsDispatch,
} from "./DocumentOperationsContext";
import OperationsList from "./OperationsList";
import PageContainer from "./PageContainer";
import { PageOperationsProvider } from "./PageOperationsContext";
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

  const documentOperations = useDocumentOperations();
  const documentOperationsDispatch = useDocumentOperationsDispatch();
  const pageOperations = documentOperations[pageNumber] || [];

  return (
    <section className="pdf-viewer">
      <section className="pdf-viewer__left-sidebar">
        <PageSelector
          selectedPageNumber={pageNumber}
          totalPageCount={pdfHandle.pageCount}
          onChanged={(pageNumber) => setPageNumber(pageNumber)}
        />
      </section>

      <PageOperationsProvider
        pageOperations={pageOperations}
        dispatchPageOperationsUpdate={(updatedOperations) => {
          documentOperationsDispatch({
            type: "UPDATE_PAGE_OPERATIONS",
            pageNumber: pageNumber,
            updatedOperations: updatedOperations,
          });
        }}
      >
        <section className="pdf-viewer__content">
          {pageHandle === undefined ? (
            <p>Loading...</p>
          ) : (
            <PageContainer width={800} pageHandle={pageHandle} />
          )}
        </section>

        <section className="pdf-viewer__right-sidebar">
          <OperationsList />
        </section>
      </PageOperationsProvider>
    </section>
  );
}

export default PdfViewer;
