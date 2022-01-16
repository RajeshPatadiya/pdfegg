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

      const v = viewerRef.current;

      const { x, y } = contentTouchdown;

      const viewerX = clamp(e.clientX - v.offsetLeft, 0, v.clientWidth);
      const viewerY = clamp(e.clientY - v.offsetTop, 0, v.clientHeight);

      const contentX = viewerX;
      const contentY = viewerY + v.scrollTop;

      const top = Math.min(contentY, y);
      const left = Math.min(contentX, x);

      const width = Math.abs(contentX - x);
      const height = Math.abs(contentY - y);

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

        const v = viewerRef.current;

        const contentX = e.clientX - v.offsetLeft;
        const contentY = e.clientY - v.offsetTop + v.scrollTop;

        setContentTouchdown({
          x: contentX,
          y: contentY,
        });
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

export default InteractivePdfViewer;
