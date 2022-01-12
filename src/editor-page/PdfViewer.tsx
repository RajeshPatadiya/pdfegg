import { useEffect, useReducer, useRef, useState } from "react";
import useDebounce from "../common/hooks/useDebounce";
import Window from "../common/Window";
import RectDrawable from "../pdf-modification/drawables/RectDrawable";
import { PdfHandle, PdfPageHandle } from "../pdf-rendering";
import { Page } from "./Page";
import WindowOverlayCanvas from "./WindowOverlayCanvas";

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

  const itemsRef = useRef<Array<HTMLElement>>([]);

  const [dragState, dragDispatch] = useReducer(dragReducer, null);

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

  const renderSelectionBox = (context: CanvasRenderingContext2D) => {
    if (!dragState) return;

    const { start, end } = dragState;
    const width = end.x - start.x;
    const height = end.y - start.y;

    context.fillStyle = "rgba(255,138,0,0.2)";
    context.strokeStyle = "rgba(255,138,0,0.8)";
    context.beginPath();
    context.rect(start.x, start.y, width, height);
    context.fill();
    context.stroke();
    context.closePath();
  };

  return (
    <section className="pdf-viewer">
      <section className="pdf-viewer__left-sidebar"></section>

      <section className="pdf-viewer__content">
        <WindowOverlayCanvas
          render={renderSelectionBox}
          onPointerDown={(coordinate) =>
            dragDispatch({ type: "DRAG_START", coordinate })
          }
          onPointerMove={(coordinate) =>
            dragDispatch({
              type: "DRAG_UPDATE",
              coordinate,
            })
          }
          onPointerUp={(coordinate) => dragDispatch({ type: "DRAG_END" })}
        >
          <Window
            itemsRef={itemsRef}
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
                  drawablePreview={
                    new RectDrawable(
                      { x: 0, y: 0, width: 100, height: 100 },
                      "blue"
                    )
                  }
                />
              );
            })}
          </Window>
        </WindowOverlayCanvas>
      </section>

      <section className="pdf-viewer__right-sidebar"></section>
    </section>
  );
}

type Coordinate = {
  x: number;
  y: number;
};

type DragState = {
  start: Coordinate;
  end: Coordinate;
} | null;

interface DragStartAction {
  type: "DRAG_START";
  coordinate: Coordinate;
}

interface DragUpdateAction {
  type: "DRAG_UPDATE";
  coordinate: Coordinate;
}

interface DragEndAction {
  type: "DRAG_END";
}

type DragAction = DragStartAction | DragUpdateAction | DragEndAction;

function dragReducer(state: DragState, action: DragAction): DragState {
  switch (action.type) {
    case "DRAG_START":
      return { start: action.coordinate, end: action.coordinate };
    case "DRAG_UPDATE":
      if (!state) return state;
      return {
        ...state,
        end: action.coordinate,
      };
    case "DRAG_END":
      return null;
  }
}

export default PdfViewer;
