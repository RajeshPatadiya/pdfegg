import { useCallback, useEffect, useState } from "react";
import Window from "../common/Window";
import { PdfHandle, PdfPageHandle } from "../pdf-rendering";
import { Page } from "./Page";

interface PdfViewerProps {
  pdfHandle: PdfHandle;
}

type LoadedPagesState = Record<number, PdfPageHandle>;

function PdfViewer({ pdfHandle }: PdfViewerProps) {
  const [defaultAspectRatio, setDefaultAspectRatio] = useState<number>();
  const [loadedPages, setLoadedPages] = useState<LoadedPagesState>({});

  useEffect(() => {
    async function loadDefaultAspectRatio() {
      const firstPage = await pdfHandle.getPage(1);
      setDefaultAspectRatio(firstPage.aspectRatio);
    }

    loadDefaultAspectRatio();
  }, [pdfHandle]);

  if (defaultAspectRatio === undefined) {
    return <p>Loading default aspect ratio</p>;
  }

  return (
    <section className="pdf-viewer">
      <section className="pdf-viewer__left-sidebar"></section>

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
                defaultAspectRatio={defaultAspectRatio}
              />
            );
          }}
          onVisibleChanged={async (visibleStartIndex, visibleEndIndex) => {
            console.log(visibleStartIndex, visibleEndIndex);

            // const visibleCount = visibleEndIndex - visibleStartIndex + 1;
            // const maxLoadedCount = Math.max(visibleCount + 2, 10);

            const newState: LoadedPagesState = {};

            // Preload at least one invisible page on top and bottom.
            const startIndex = Math.max(0, visibleStartIndex - 1);
            const endIndex = Math.min(
              pdfHandle.pageCount - 1,
              visibleEndIndex + 1
            );

            for (let i = startIndex; i <= endIndex; i++) {
              const pageNumber = i + 1;

              if (loadedPages[pageNumber] !== undefined) {
                newState[pageNumber] = loadedPages[pageNumber];
              } else {
                newState[pageNumber] = await pdfHandle.getPage(pageNumber);
              }
            }

            // Unload from memory pages made invisible.
            Object.keys(loadedPages)
              .map(Number)
              .filter((pageNumber) => newState[pageNumber] === undefined)
              .forEach((pageNumber) =>
                loadedPages[pageNumber].releaseResources()
              );

            setLoadedPages(newState);
            console.log(Object.keys(newState));
          }}
        />
      </section>

      <section className="pdf-viewer__right-sidebar"></section>
    </section>
  );
}

export default PdfViewer;
