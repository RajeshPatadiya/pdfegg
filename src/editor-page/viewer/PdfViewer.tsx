import { useEffect, useState } from "react";
import useDebounce from "../../common/hooks/useDebounce";
import { Size, sizeAspectRatio } from "../../common/Measure";
import Drawable from "../../pdf-modification/drawables/Drawable";
import { PdfHandle, PdfPageHandle } from "../../pdf-rendering";
import { Page } from "./../Page";
import Viewer, { VisibleRange } from "./Viewer";

export type DrawablesMap = {
  [pageNumber: number]: Drawable;
};

interface PdfViewerProps {
  pdfHandle: PdfHandle;
  afterChildren: React.ReactElement[];
  pageSizesRef: React.MutableRefObject<(Size | null)[]>;
  visibleRangeRef: React.MutableRefObject<VisibleRange>;
  viewerRef: React.RefObject<HTMLDivElement>;
  itemsRef: React.MutableRefObject<HTMLElement[]>;
  previewDrawables: DrawablesMap;
}

type PageHandlesArray = Array<PdfPageHandle | null>;

function PdfViewer({
  pdfHandle,
  pageSizesRef,
  previewDrawables,
  ...otherProps
}: PdfViewerProps) {
  const [pageHandles, setPageHandles] = useState<PageHandlesArray>([]);

  const debounce = useDebounce(150);

  useEffect(() => {
    async function initState() {
      const sizes = Array(pdfHandle.pageCount).fill(null);
      const handles = Array(pdfHandle.pageCount).fill(null);

      const firstPage = await pdfHandle.getPage(1);

      sizes[0] = firstPage.size;
      handles[0] = firstPage;

      pageSizesRef.current = sizes;
      setPageHandles(handles);
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
      pageSizesRef.current[i] = newLoadedPages[i]!.size;
    }

    // Unload from memory removed pages.
    pageHandles
      .filter((handle, i) => handle !== null && newLoadedPages[i] === null)
      .forEach((handle) => handle?.releaseResources());

    setPageHandles(newLoadedPages);
  }

  const width = 800;
  const sizes = pageSizesRef.current;
  const firstPageAspectRatio = sizeAspectRatio(sizes[0]!);

  return (
    <Viewer
      onVisibleChanged={(start, end) =>
        debounce(() => handleVisibleChanged(start, end))
      }
      {...otherProps}
    >
      {pageHandles.map((pageHandle, i) => {
        const pageNumber = i + 1;
        const pageSize = sizes[i];
        return (
          <Page
            key={pageNumber}
            pageNumber={pageNumber}
            pageHandle={pageHandle}
            width={width}
            fallbackAspectRatio={
              pageSize ? sizeAspectRatio(pageSize) : firstPageAspectRatio
            }
            previewDrawable={previewDrawables[pageNumber]}
          />
        );
      })}
    </Viewer>
  );
}

export default PdfViewer;
