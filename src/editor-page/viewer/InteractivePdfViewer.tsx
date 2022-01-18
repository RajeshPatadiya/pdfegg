import classNames from "classnames";
import {
  PointerEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Box,
  boxBottom,
  boxIntersection,
  boxScaleCoord,
} from "../../common/Box";
import { clamp } from "../../common/math";
import { Coord, Size } from "../../common/Measure";
import RectDrawable from "../../pdf-modification/drawables/RectDrawable";
import { PdfHandle } from "../../pdf-rendering";
import { useDocumentOperationsDispatch } from "../DocumentOperationsContext";
import { Tool } from "../Toolbar";
import PdfViewer, { DrawablesMap } from "./PdfViewer";
import { VisibleRange } from "./Viewer";

interface Props {
  pdfHandle: PdfHandle;
  tool: Tool;
}

function InteractivePdfViewer({ pdfHandle, tool }: Props) {
  const visibleRangeRef = useRef<VisibleRange>({
    startIndex: 0,
    endIndex: 0,
  });
  const viewerRef = useRef<HTMLDivElement>(null);
  const pagesRef = useRef<HTMLElement[]>([]);
  const pageSizesRef = useRef<Array<Size | null>>([]);

  const [contentTouchdown, setContentTouchdown] = useState<Coord | null>(null);
  const [selectionBox, setSelectionBox] = useState<Box | null>(null);
  const touchdownPageIndexRef = useRef<number | null>(null);

  const [previewDrawables, setPreviewDrawables] = useState<DrawablesMap>({});

  const dispatch = useDocumentOperationsDispatch();

  useEffect(() => {
    if (!contentTouchdown) return;

    const onPointerMove = (e: PointerEvent) => {
      if (!contentTouchdown || !viewerRef.current) {
        return;
      }

      const pointerClientCoord: Coord = {
        x: e.clientX,
        y: e.clientY,
      };
      const pointerContentCoord = clientToContentCoord(
        pointerClientCoord,
        viewerRef.current
      );
      const selectionContentBox = boxFromTwoPoints(
        contentTouchdown,
        pointerContentCoord
      );

      const { startIndex, endIndex } = visibleRangeRef.current;

      const drawables: DrawablesMap = {};
      const sizes = pageSizesRef.current;

      for (let i = startIndex; i <= endIndex; i++) {
        const page = pagesRef.current[i];
        const pageContentBox = getPageContentBox(page);
        const intersection = boxIntersection(
          pageContentBox,
          selectionContentBox
        );

        if (intersection) {
          const pdfBox = contentToPdfBox(
            intersection,
            pageContentBox,
            sizes[i]!.width
          );
          drawables[i + 1] = new RectDrawable(pdfBox, "#cccccc");
        }
      }

      setPreviewDrawables(drawables);
      setSelectionBox(selectionContentBox);
    };

    const onPointerUp = (_: PointerEvent) => {
      // TODO: Use touchdown page to determine the affected page range
      // start = min(touchdownPageIndex, visibleStart)
      // end = max(touchdownPageIndex, visibleEnd)

      touchdownPageIndexRef.current = null;

      setContentTouchdown(null);
      setSelectionBox(null);
      setPreviewDrawables({});

      dispatch({
        type: "ADD_DRAWABLES",
        drawableForPage: previewDrawables,
      });
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [contentTouchdown, previewDrawables]);

  const onPointerDown: PointerEventHandler = useCallback((e) => {
    e.preventDefault();
    if (!viewerRef.current) return;

    const clientCoord: Coord = {
      x: e.clientX,
      y: e.clientY,
    };
    const contentCoord = clientToContentCoord(clientCoord, viewerRef.current);

    // Store touchdown page (might become invisible on scroll)
    const { startIndex, endIndex } = visibleRangeRef.current;

    let touchdownPageIndex = endIndex;

    for (let i = startIndex; i <= endIndex; i++) {
      const page = pagesRef.current[i];
      const pageContentBox = getPageContentBox(page);
      if (boxBottom(pageContentBox) > contentCoord.y) {
        touchdownPageIndex = i;
        break;
      }
    }

    touchdownPageIndexRef.current = touchdownPageIndex;

    setContentTouchdown(contentCoord);
  }, []);

  return (
    <div style={{ height: "100%" }} onPointerDown={onPointerDown}>
      <PdfViewer
        pdfHandle={pdfHandle}
        pageSizesRef={pageSizesRef}
        visibleRangeRef={visibleRangeRef}
        viewerRef={viewerRef}
        itemsRef={pagesRef}
        afterChildren={
          selectionBox
            ? [
                <div
                  key="selection-box"
                  className={classNames("selection-box", {
                    "selection-fill": tool === "move",
                  })}
                  style={{
                    position: "absolute",
                    top: selectionBox.y,
                    left: selectionBox.x,
                    width: selectionBox.width,
                    height: selectionBox.height,
                  }}
                />,
              ]
            : []
        }
        previewDrawables={previewDrawables}
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

function getPageContentBox(page: HTMLElement): Box {
  return {
    x: page.offsetLeft,
    y: page.offsetTop,
    width: page.clientWidth,
    height: page.clientHeight,
  };
}

function contentToPdfBox(
  contentBox: Box,
  pageContentBox: Box,
  pdfPageWidth: number
): Box {
  const pdfCoordScalar = pdfPageWidth / pageContentBox.width;
  const relativeBox = {
    x: contentBox.x - pageContentBox.x,
    y: contentBox.y - pageContentBox.y,
    width: contentBox.width,
    height: contentBox.height,
  };
  return boxScaleCoord(relativeBox, pdfCoordScalar);
}

export default InteractivePdfViewer;
