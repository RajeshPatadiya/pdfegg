import { ReactNode, useCallback, useEffect, useState } from "react";
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
          onVisibleChanged={(visibleStartIndex, visibleEndIndex) => {}}
        />
      </section>

      <section className="pdf-viewer__right-sidebar"></section>
    </section>
  );
}

interface WindowProps {
  itemCount: number;
  buildItem: (index: number) => ReactNode;
  onVisibleChanged: (
    visibleStartIndex: number,
    visibleEndIndex: number
  ) => void;
}

function Window(props: WindowProps) {
  const items = Array(props.itemCount)
    .fill(null)
    .map((_, index) => props.buildItem(index));

  return (
    <div
      style={{ height: "100%", overflow: "scroll" }}
      onScroll={(e) =>
        console.log(e.currentTarget.scrollTop, e.currentTarget.clientHeight)
      }
    >
      {items}
    </div>
  );
}

export default PdfViewer;
