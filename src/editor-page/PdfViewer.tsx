import { useEffect, useState } from "react";
import useDebounce from "../common/hooks/useDebounce";
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

  const debounce = useDebounce(150);

  if (defaultAspectRatio === undefined) {
    return <p>Loading default aspect ratio</p>;
  }

  async function handleVisibleChanged(startIndex: number, endIndex: number) {
    const newPages: PagesState = Array(pages.length).fill(null);

    // Preload at least one invisible page on top and bottom.
    const start = Math.max(0, startIndex - 1);
    const end = Math.min(pages.length - 1, endIndex + 1);

    for (let i = start; i <= end; i++) {
      newPages[i] = pages[i] || (await pdfHandle.getPage(i + 1));
    }

    // Unload from memory removed pages.
    pages
      .filter((handle, i) => handle !== null && newPages[i] === null)
      .forEach((handle) => handle?.releaseResources());

    setPages(newPages);
  }

  return (
    <section className="pdf-viewer">
      <section className="pdf-viewer__left-sidebar"></section>

      <section className="pdf-viewer__content">
        <Window
          onVisibleChanged={(start, end) =>
            debounce(() => handleVisibleChanged(start, end))
          }
        >
          {pages.map((pageHandle, i) => {
            const pageNumber = i + 1;
            return (
              <Page
                key={pageNumber}
                pageNumber={pageNumber}
                pageHandle={pageHandle}
                defaultAspectRatio={defaultAspectRatio}
              />
            );
          })}
        </Window>
      </section>

      <section className="pdf-viewer__right-sidebar"></section>
    </section>
  );
}

export default PdfViewer;
