import { useEffect, useState } from "react";
import useKeyDownEffect from "../common/useKeyDownEffect";
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
  const [loadedPages, setLoadedPages] = useState<LoadedPagesState>({});

  const documentOperations = useDocumentOperations();
  const documentOperationsDispatch = useDocumentOperationsDispatch();

  const pageNumber = documentOperations.selectedPageNumber;
  const setPageNumber = (newPageNumber: number) => {
    documentOperationsDispatch({
      type: "CHANGE_SELECTED_PAGE",
      newSelectedPageNumber: newPageNumber,
    });
  };

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

  const pages = Array(pdfHandle.pageCount)
    .fill(undefined)
    .map((_, i) => loadedPages[i + 1]);
  console.log(pages);

  return (
    <section className="pdf-viewer">
      <section className="pdf-viewer__left-sidebar">
        <PageSelector
          selectedPageNumber={pageNumber}
          totalPageCount={pdfHandle.pageCount}
          onChanged={(pageNumber) => setPageNumber(pageNumber)}
        />
      </section>

      <section className="pdf-viewer__content">
        {pages.map((pageHandle, index) =>
          pageHandle === undefined ? (
            <p>Loading...</p>
          ) : (
            <PageOperationsProvider
              state={documentOperations.operationsPerPage[index + 1]}
              dispatchState={(newState) => {
                documentOperationsDispatch({
                  type: "UPDATE_PAGE_OPERATIONS",
                  pageNumber: index + 1,
                  updatedOperations: newState,
                });
              }}
            >
              <PageContainer width={800} pageHandle={pageHandle} />
            </PageOperationsProvider>
          )
        )}
      </section>

      <section className="pdf-viewer__right-sidebar">
        {/* <OperationsList /> */}
      </section>
    </section>
  );
}

export default PdfViewer;
