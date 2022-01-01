import { useCallback, useEffect, useState } from "react";
import { PdfHandle, PdfPageHandle } from "../pdf-rendering";
import {
  useDocumentOperationsDispatch,
  useDocumentPageOperations,
} from "./DocumentOperationsContext";
import PageContainer from "./PageContainer";
import { PageOperationsProvider } from "./PageOperationsContext";

interface PdfViewerProps {
  pdfHandle: PdfHandle;
}

type LoadedPagesState = Record<number, PdfPageHandle>;

function PdfViewer({ pdfHandle }: PdfViewerProps) {
  const [loadedPages, setLoadedPages] = useState<LoadedPagesState>({});

  const loadPage = useCallback(
    async (pageNumber: number) => {
      console.log(`load page ${pageNumber}`);
      const pdfPageHandle = await pdfHandle.getPage(pageNumber);
      setLoadedPages((loadedPages) => {
        return { ...loadedPages, [pageNumber]: pdfPageHandle };
      });
    },
    [pdfHandle]
  );

  useEffect(() => {
    loadPage(1);
  }, [pdfHandle]);

  return (
    <section className="pdf-viewer">
      <section className="pdf-viewer__left-sidebar"></section>

      <section className="pdf-viewer__content">
        {Array(pdfHandle.pageCount)
          .fill(undefined)
          .map((_, index) => (
            <Page
              key={index}
              pageNumber={index + 1}
              pageHandle={loadedPages[index + 1]}
            />
          ))}
      </section>

      <section className="pdf-viewer__right-sidebar"></section>
    </section>
  );
}

function Page({
  pageNumber,
  pageHandle,
}: {
  pageNumber: number;
  pageHandle?: PdfPageHandle;
}) {
  const pageOperations = useDocumentPageOperations(pageNumber);
  const documentOperationsDispatch = useDocumentOperationsDispatch();

  if (pageHandle === undefined) {
    // TODO: Replace with page-container of default size (first page size)
    return <p>Loading...</p>;
  }

  return (
    <PageOperationsProvider
      state={pageOperations}
      dispatchState={(newState) => {
        documentOperationsDispatch({
          type: "UPDATE_PAGE_OPERATIONS",
          pageNumber: pageNumber,
          updatedOperations: newState,
        });
      }}
    >
      <PageContainer width={800} pageHandle={pageHandle} />
    </PageOperationsProvider>
  );
}

export default PdfViewer;
