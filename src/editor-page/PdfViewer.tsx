import { useEffect, useState } from "react";
import Window from "../common/Window";
import { PdfHandle, PdfPageHandle } from "../pdf-rendering";
import { Page } from "./Page";

interface PdfViewerProps {
  pdfHandle: PdfHandle;
}

type PagesState = Array<PdfPageHandle | null>;

function PdfViewer({ pdfHandle }: PdfViewerProps) {
  const [defaultAspectRatio, setDefaultAspectRatio] = useState<number>();

  const [pages, setPages] = useState<PagesState>(
    Array(pdfHandle.pageCount).fill(null)
  );

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
                pageHandle={pages[index]}
                defaultAspectRatio={defaultAspectRatio}
              />
            );
          }}
          onVisibleChanged={async (visibleStartIndex, visibleEndIndex) => {
            console.log(visibleStartIndex, visibleEndIndex);

            // const visibleCount = visibleEndIndex - visibleStartIndex + 1;
            // const maxLoadedCount = Math.max(visibleCount + 2, 10);

            const newPages: PagesState = Array(pages.length).fill(null);

            // Preload at least one invisible page on top and bottom.
            const startIndex = Math.max(0, visibleStartIndex - 1);
            const endIndex = Math.min(pages.length - 1, visibleEndIndex + 1);

            for (let i = startIndex; i <= endIndex; i++) {
              newPages[i] = pages[i] || (await pdfHandle.getPage(i + 1));
            }

            // Unload from memory removed pages.
            pages
              .filter((handle, i) => handle !== null && newPages[i] === null)
              .forEach((handle) => handle?.releaseResources());

            setPages(newPages);
          }}
        />
      </section>

      <section className="pdf-viewer__right-sidebar"></section>
    </section>
  );
}

export default PdfViewer;
