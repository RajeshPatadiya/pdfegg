import { useCallback, useEffect, useState } from "react";
import { PdfHandle, PdfPageHandle } from "../pdf-rendering";
import { Page } from "./Page";

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

  if (loadedPages[1] === undefined) {
    return <p>Loading first page</p>;
  }

  const firstPage = loadedPages[1];

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
              defaultAspectRatio={firstPage.aspectRatio}
            />
          ))}
      </section>

      <section className="pdf-viewer__right-sidebar"></section>
    </section>
  );
}

export default PdfViewer;
