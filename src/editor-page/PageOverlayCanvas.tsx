import { useCallback, useReducer } from "react";
import HighDpiCanvas from "../common/HighDpiCanvas";
import RectDrawingOperation from "../pdf-generator/operations/RectDrawingOperation";
import { useOperations, useOperationsDispatch } from "./OperationsContext";

interface PageOverlayCanvasProps {
  width: number;
  height: number;
  pageWidth: number;
}

interface Coordinate {
  x: number;
  y: number;
}

function PageOverlayCanvas({
  width,
  height,
  pageWidth,
}: PageOverlayCanvasProps) {
  const [boxState, boxStateDispatch] = useReducer(
    boxStateReducer,
    initialBoxState
  );
  const operations = useOperations();
  const operationsDispatch = useOperationsDispatch();

  const renderBox = useCallback(
    (context) => {
      operations.forEach((op) => op.applyOnCanvas(context, pageWidth));

      if (boxState.operation !== null) {
        boxState.operation.applyOnCanvas(context, pageWidth);
      }
    },
    [boxState, operations, pageWidth]
  );

  const getMouseCoords = (e: React.MouseEvent): Coordinate => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const getPageCoords = (e: React.MouseEvent): Coordinate => {
    const { x, y } = getMouseCoords(e);
    return {
      x: scaleContainerToPageUnits(x),
      y: scaleContainerToPageUnits(y),
    };
  };

  const scaleContainerToPageUnits = (containerUnits: number): number =>
    (containerUnits / width) * pageWidth;

  const onDragStart: React.MouseEventHandler = (e) => {
    const { x, y } = getPageCoords(e);
    boxStateDispatch({ type: "DRAG_START", x, y });
  };

  const onDragUpdate: React.MouseEventHandler = (e) => {
    if (boxState.operation === null) return;
    const { x, y } = getPageCoords(e);
    boxStateDispatch({ type: "DRAG_UPDATE", x, y });
  };

  const onDragEnd: React.MouseEventHandler = (e) => {
    if (boxState.operation === null) return;
    boxStateDispatch({ type: "DRAG_END" });
    operationsDispatch({ type: "ADD", operation: boxState.operation });
  };

  return (
    <HighDpiCanvas
      width={width}
      height={height}
      render={renderBox}
      onMouseDown={onDragStart}
      onMouseMove={onDragUpdate}
      onMouseUp={onDragEnd}
      onMouseLeave={onDragEnd}
    />
  );
}

interface BoxState {
  operation: RectDrawingOperation | null;
}

interface BoxDragStartAction {
  type: "DRAG_START";
  x: number;
  y: number;
}

interface BoxDragUpdateAction {
  type: "DRAG_UPDATE";
  x: number;
  y: number;
}

interface BoxDragEndAction {
  type: "DRAG_END";
}

type BoxAction = BoxDragStartAction | BoxDragUpdateAction | BoxDragEndAction;

const initialBoxState: BoxState = { operation: null };

function boxStateReducer(state: BoxState, action: BoxAction) {
  const { operation } = state;

  switch (action.type) {
    case "DRAG_START":
      return {
        dragging: true,
        operation: new RectDrawingOperation(action.x, action.y, 0, 0),
      };
    case "DRAG_UPDATE":
      if (operation === null) return state;
      const width = action.x - operation.x;
      const height = action.y - operation.y;
      return {
        operation: new RectDrawingOperation(
          operation.x,
          operation.y,
          width,
          height
        ),
      };
    case "DRAG_END":
      return { operation: null };
    default:
      return state;
  }
}

export default PageOverlayCanvas;
