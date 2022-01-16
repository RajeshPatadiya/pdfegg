import { useEffect, useRef, useState } from "react";
import { clamp } from "../../common/math";
import { PdfHandle } from "../../pdf-rendering";
import PdfViewer from "./PdfViewer";

interface Props {
  pdfHandle: PdfHandle;
}

interface Coord {
  x: number;
  y: number;
}

function InteractivePdfViewer({ pdfHandle }: Props) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const pagesRef = useRef<HTMLElement[]>([]);

  const [contentTouchdown, setContentTouchdown] = useState<Coord | null>(null);
  const selectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentTouchdown) return;

    const onPointerMove = (e: PointerEvent) => {
      if (!contentTouchdown || !viewerRef.current || !selectionRef.current) {
        return;
      }

      const clientCoord: Coord = {
        x: e.clientX,
        y: e.clientY,
      };
      const contentCoord = clientToContentCoord(clientCoord, viewerRef.current);

      const top = Math.min(contentCoord.y, contentTouchdown.y);
      const left = Math.min(contentCoord.x, contentTouchdown.x);

      const width = Math.abs(contentCoord.x - contentTouchdown.x);
      const height = Math.abs(contentCoord.y - contentTouchdown.y);

      const style = selectionRef.current.style;

      style.top = `${top}px`;
      style.left = `${left}px`;
      style.width = `${width}px`;
      style.height = `${height}px`;
    };

    const onPointerUp = (_: PointerEvent) => setContentTouchdown(null);

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [contentTouchdown]);

  return (
    <div
      style={{ height: "100%" }}
      onPointerDown={(e) => {
        e.preventDefault();
        if (!viewerRef.current) return;

        const clientCoord: Coord = {
          x: e.clientX,
          y: e.clientY,
        };
        const contentCoord = clientToContentCoord(
          clientCoord,
          viewerRef.current
        );

        setContentTouchdown(contentCoord);
      }}
    >
      <PdfViewer
        pdfHandle={pdfHandle}
        viewerRef={viewerRef}
        pagesRef={pagesRef}
        afterChildren={
          contentTouchdown
            ? [
                <div
                  ref={selectionRef}
                  className="selection-box"
                  style={{
                    position: "absolute",
                    top: contentTouchdown.y,
                    left: contentTouchdown.x,
                  }}
                />,
              ]
            : []
        }
      />
    </div>
  );
}

function clientToViewerCoord(
  clientCoord: Coord,
  viewer: HTMLDivElement
): Coord {
  return {
    x: clamp(clientCoord.x - viewer.offsetLeft, 0, viewer.clientWidth),
    y: clamp(clientCoord.y - viewer.offsetTop, 0, viewer.clientHeight),
  };
}

function clientToContentCoord(
  clientCoord: Coord,
  viewer: HTMLDivElement
): Coord {
  const viewerCoord = clientToViewerCoord(clientCoord, viewer);
  return viewerToContentCoord(viewerCoord, viewer);
}

function viewerToContentCoord(viewerCoord: Coord, viewer: HTMLDivElement) {
  return {
    x: viewerCoord.x,
    y: viewerCoord.y + viewer.scrollTop,
  };
}

export default InteractivePdfViewer;
