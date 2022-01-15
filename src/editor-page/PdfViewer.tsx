import { useEffect, useRef, useState } from "react";
import { Box } from "../common/Box";
import useDebounce from "../common/hooks/useDebounce";
import { clamp } from "../common/math";
import Viewer from "../common/Viewer";
import { PdfHandle, PdfPageHandle } from "../pdf-rendering";
import { Page } from "./Page";

interface PdfViewerProps {
  pdfHandle: PdfHandle;
}

type PageHandlesArray = Array<PdfPageHandle | null>;

function PdfViewer({ pdfHandle }: PdfViewerProps) {
  const [pageHandles, setPageHandles] = useState<PageHandlesArray>([]);
  const pageAspectRatiosRef = useRef<number[]>([]);

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

  const debounce = useDebounce(150);

  const viewerRef = useRef<HTMLDivElement>(null);

  // For later retrieving of page positions in Viewer.
  const itemsRef = useRef<HTMLElement[]>([]);

  const [selectionBox, setSelectionBox] = useState<Box>();

  const selectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (!viewerRef.current) return;
      if (!selectionBox) return;

      const v = viewerRef.current;

      const { x, y } = selectionBox;

      const viewerX = clamp(e.clientX - v.offsetLeft, 0, v.clientWidth);
      const viewerY = clamp(e.clientY - v.offsetTop, 0, v.clientHeight);

      const contentX = viewerX;
      const contentY = viewerY + v.scrollTop;

      const top = Math.min(contentY, y);
      const left = Math.min(contentX, x);

      const width = Math.abs(contentX - x);
      const height = Math.abs(contentY - y);

      const style = selectionRef.current!.style;

      style.top = `${top}px`;
      style.left = `${left}px`;
      style.width = `${width}px`;
      style.height = `${height}px`;
    };

    const onPointerUp = (e: PointerEvent) => setSelectionBox(undefined);

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [selectionBox]);

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
    <div
      style={{ height: "100%" }}
      onPointerDown={(e) => {
        e.preventDefault();
        if (!viewerRef.current) return;

        const v = viewerRef.current;

        const contentX = e.clientX - v.offsetLeft;
        const contentY = e.clientY - v.offsetTop + v.scrollTop;

        setSelectionBox({
          x: contentX,
          y: contentY,
          width: 0,
          height: 0,
        });
      }}
    >
      <Viewer
        viewerRef={viewerRef}
        itemsRef={itemsRef}
        onVisibleChanged={(start, end) =>
          debounce(() => handleVisibleChanged(start, end))
        }
        afterChildren={
          selectionBox
            ? [
                <div
                  ref={selectionRef}
                  className="selection-box"
                  style={{
                    position: "absolute",
                    top: selectionBox.y,
                    left: selectionBox.x,
                  }}
                />,
              ]
            : []
        }
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
    </div>
  );
}

export default PdfViewer;
