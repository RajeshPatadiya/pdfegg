import { useEffect, useState } from "react";
import { PdfHandle, PdfPageHandle } from "../pdf-rendering";
import {
  useDocumentOperations,
  useDocumentOperationsDispatch,
} from "./DocumentOperationsContext";
import PageContainer from "./PageContainer";
import { PageOperationsProvider } from "./PageOperationsContext";

interface PdfViewerProps {
  pdfHandle: PdfHandle;
}

type LoadedPagesState = Record<number, PdfPageHandle>;

function PdfViewer({ pdfHandle }: PdfViewerProps) {
  const [loadedPages, setLoadedPages] = useState<LoadedPagesState>({});

  const documentOperations = useDocumentOperations();
  const documentOperationsDispatch = useDocumentOperationsDispatch();

  useEffect(() => {
    async function loadPage(pageNumber: number) {
      console.log(`load page ${pageNumber}`);
      const pdfPageHandle = await pdfHandle.getPage(pageNumber);
      setLoadedPages((loadedPages) => {
        return { ...loadedPages, [pageNumber]: pdfPageHandle };
      });
    }

    for (let i = 1; i <= pdfHandle.pageCount; i++) {
      loadPage(i);
    }
  }, [pdfHandle]);

  const pages = Array(pdfHandle.pageCount)
    .fill(undefined)
    .map((_, i) => loadedPages[i + 1]);
  console.log(pages);

  return (
    <section className="pdf-viewer">
      <section className="pdf-viewer__left-sidebar"></section>

      <section className="pdf-viewer__content">
        {pages.map((pageHandle, index) =>
          pageHandle === undefined ? (
            // TODO: Replace with page-container of default size (first page size)
            <p key={index}>Loading...</p>
          ) : (
            <PageOperationsProvider
              key={index}
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

      <section className="pdf-viewer__right-sidebar"></section>
    </section>
  );
}

export default PdfViewer;
