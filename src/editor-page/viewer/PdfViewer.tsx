import { useEffect, useRef, useState } from "react";
import useDebounce from "../../common/hooks/useDebounce";
import { PdfHandle, PdfPageHandle } from "../../pdf-rendering";
import { Page } from "./../Page";
import Viewer from "./Viewer";

interface PdfViewerProps {
  pdfHandle: PdfHandle;
  afterChildren: React.ReactElement[];
  viewerRef: React.RefObject<HTMLDivElement>;
  pagesRef: React.MutableRefObject<HTMLElement[]>;
}

type PageHandlesArray = Array<PdfPageHandle | null>;

function PdfViewer({
  pdfHandle,
  afterChildren,
  viewerRef,
  pagesRef,
}: PdfViewerProps) {
  const [pageHandles, setPageHandles] = useState<PageHandlesArray>([]);
  const pageAspectRatiosRef = useRef<number[]>([]);
  const debounce = useDebounce(150);

  useEffect(() => {
    async function initState() {
      const handles = Array(pdfHandle.pageCount).fill(null);
      const firstPage = await pdfHandle.getPage(1);

      handles[0] = firstPage;
      setPageHandles(handles);

      pageAspectRatiosRef.current = [firstPage.aspectRatio];
    }

    initState();
  }, [pdfHandle]);

  if (pageHandles.length === 0) {
    return null;
  }

  async function handleVisibleChanged(startIndex: number, endIndex: number) {
    const newLoadedPages: PageHandlesArray = Array(pageHandles.length).fill(
      null
    );

    // Preload at least one invisible page on top and bottom.
    const start = Math.max(0, startIndex - 1);
    const end = Math.min(pageHandles.length - 1, endIndex + 1);

    for (let i = start; i <= end; i++) {
      newLoadedPages[i] = pageHandles[i] || (await pdfHandle.getPage(i + 1));
      pageAspectRatiosRef.current[i] = newLoadedPages[i]!.aspectRatio;
    }

    // Unload from memory removed pages.
    pageHandles
      .filter((handle, i) => handle !== null && newLoadedPages[i] === null)
      .forEach((handle) => handle?.releaseResources());

    setPageHandles(newLoadedPages);
  }

  const pageWidth = 800;

  return (
    <Viewer
      viewerRef={viewerRef}
      itemsRef={pagesRef}
      onVisibleChanged={(start, end) =>
        debounce(() => handleVisibleChanged(start, end))
      }
      afterChildren={afterChildren}
    >
      {pageHandles.map((pageHandle, i) => {
        const pageNumber = i + 1;
        return (
          <Page
            key={pageNumber}
            pageNumber={pageNumber}
            pageHandle={pageHandle}
            width={pageWidth}
            fallbackAspectRatio={
              pageAspectRatiosRef.current[i] || pageAspectRatiosRef.current[0]
            }
          />
        );
      })}
    </Viewer>
  );
}

export default PdfViewer;
