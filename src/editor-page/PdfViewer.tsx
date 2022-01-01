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

  async function loadPage(pageNumber: number) {
    console.log(`load page ${pageNumber}`);
    const pdfPageHandle = await pdfHandle.getPage(pageNumber);
    setLoadedPages((loadedPages) => {
      return { ...loadedPages, [pageNumber]: pdfPageHandle };
    });
  }

  useEffect(() => {
    loadPage(1);
  }, [pdfHandle]);

  const Page = (props: { index: number }) => {
    const pageNumber = props.index + 1;
    const pageHandle = loadedPages[pageNumber];

    if (pageHandle === undefined) {
      // TODO: Replace with page-container of default size (first page size)
      return <p>Loading...</p>;
    }

    const pageOperations = documentOperations.operationsPerPage[pageNumber];

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
  };

  return (
    <section className="pdf-viewer">
      <section className="pdf-viewer__left-sidebar"></section>

      <section className="pdf-viewer__content">
        {Array(pdfHandle.pageCount)
          .fill(undefined)
          .map((_, index) => (
            <Page key={index} index={index} />
          ))}
      </section>

      <section className="pdf-viewer__right-sidebar"></section>
    </section>
  );
}

export default PdfViewer;
