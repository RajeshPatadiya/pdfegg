import { useCallback, useEffect, useState } from "react";
import Window from "../common/Window";
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
      <section className="pdf-viewer__left-sidebar">
        <button onClick={() => loadPage(Object.keys(loadedPages).length + 1)}>
          Load more
        </button>
      </section>

      <section className="pdf-viewer__content">
        <Window
          itemCount={pdfHandle.pageCount}
          buildItem={(index) => {
            const pageNumber = index + 1;
            return (
              <Page
                key={pageNumber}
                pageNumber={pageNumber}
                pageHandle={loadedPages[pageNumber]}
                defaultAspectRatio={firstPage.aspectRatio}
              />
            );
          }}
          onVisibleChanged={(visibleStartIndex, visibleEndIndex) => {
            console.log(visibleStartIndex, visibleEndIndex);
            for (let i = visibleStartIndex; i <= visibleEndIndex; i++) {
              const pageNumber = i + 1;
              if (loadedPages[pageNumber] === undefined) {
                loadPage(pageNumber);
              }
            }
          }}
        />
      </section>

      <section className="pdf-viewer__right-sidebar"></section>
    </section>
  );
}

export default PdfViewer;
