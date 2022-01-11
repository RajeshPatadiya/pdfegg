import React, { useReducer } from "react";
import HighDpiCanvas from "../common/HighDpiCanvas";
import useDivSize from "../common/hooks/useDivSize";

interface Props {
  children: React.ReactElement;
}

function WindowOverlayCanvas({ children }: Props) {
  const [divRef, width, height] = useDivSize();

  const [dragState, dragDispatch] = useReducer(dragReducer, null);

  const getPointerCoords = (e: React.PointerEvent): Coordinate => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const onDragStart: React.PointerEventHandler = (e) => {
    dragDispatch({ type: "DRAG_START", coordinate: getPointerCoords(e) });
  };

  const onDragUpdate: React.PointerEventHandler = (e) => {
    console.log(getPointerCoords(e));
    dragDispatch({ type: "DRAG_UPDATE", coordinate: getPointerCoords(e) });
  };

  const onDragEnd: React.PointerEventHandler = (e) => {
    dragDispatch({ type: "DRAG_END" });
  };

  const renderSelectionBox = (context: CanvasRenderingContext2D) => {
    if (!dragState) return;
    console.log("render selection");

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
    <div
      ref={divRef}
      style={{ height: "100%", position: "relative" }}
      onPointerDown={onDragStart}
      onPointerMove={onDragUpdate}
      onPointerUp={onDragEnd}
    >
      {children}

      {width && height && (
        <HighDpiCanvas
          width={width}
          height={height}
          className="content__overlay"
          render={renderSelectionBox}
        />
      )}
    </div>
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

export default WindowOverlayCanvas;
