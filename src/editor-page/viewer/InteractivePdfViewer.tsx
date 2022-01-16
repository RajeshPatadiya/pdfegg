import classNames from "classnames";
import {
  PointerEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Box } from "../../common/Box";
import { clamp } from "../../common/math";
import { PdfHandle } from "../../pdf-rendering";
import { Tool } from "../Toolbar";
import PdfViewer from "./PdfViewer";

interface Props {
  pdfHandle: PdfHandle;
  tool: Tool;
}

interface Coord {
  x: number;
  y: number;
}

function InteractivePdfViewer({ pdfHandle, tool }: Props) {
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
      const contentBox = boxFromTwoPoints(contentTouchdown, contentCoord);

      const style = selectionRef.current.style;
      style.top = `${contentBox.y}px`;
      style.left = `${contentBox.x}px`;
      style.width = `${contentBox.width}px`;
      style.height = `${contentBox.height}px`;
    };

    const onPointerUp = (_: PointerEvent) => setContentTouchdown(null);

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [contentTouchdown]);

  const onPointerDown: PointerEventHandler = useCallback((e) => {
    e.preventDefault();
    if (!viewerRef.current) return;

    const clientCoord: Coord = {
      x: e.clientX,
      y: e.clientY,
    };
    const contentCoord = clientToContentCoord(clientCoord, viewerRef.current);

    setContentTouchdown(contentCoord);
  }, []);

  return (
    <div style={{ height: "100%" }} onPointerDown={onPointerDown}>
      <PdfViewer
        pdfHandle={pdfHandle}
        viewerRef={viewerRef}
        pagesRef={pagesRef}
        afterChildren={
          contentTouchdown
            ? [
                <div
                  key="selection-box"
                  className={classNames("selection-box", {
                    "selection-fill": tool === "move",
                  })}
                  ref={selectionRef}
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

function boxFromTwoPoints(a: Coord, b: Coord): Box {
  return {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    width: Math.abs(a.x - b.x),
    height: Math.abs(a.y - b.y),
  };
}

export default InteractivePdfViewer;
