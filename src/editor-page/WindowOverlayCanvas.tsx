import React from "react";
import HighDpiCanvas from "../common/HighDpiCanvas";
import useDivSize from "../common/hooks/useDivSize";

type Coordinate = {
  x: number;
  y: number;
};

interface Props {
  children: React.ReactElement;
  render: (canvasContext: CanvasRenderingContext2D) => void;
  onPointerDown: (coordinate: Coordinate) => void;
  onPointerMove: (coordinate: Coordinate) => void;
  onPointerUp: (coordinate: Coordinate) => void;
}

function WindowOverlayCanvas({
  children,
  render,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: Props) {
  const [divRef, width, height] = useDivSize();

  const getPointerCoords = (e: React.PointerEvent): Coordinate => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  return (
    <div
      ref={divRef}
      style={{ height: "100%", position: "relative" }}
      onPointerDown={(e) => onPointerDown(getPointerCoords(e))}
      onPointerMove={(e) => onPointerMove(getPointerCoords(e))}
      onPointerUp={(e) => onPointerUp(getPointerCoords(e))}
    >
      {children}

      {width && height && (
        <HighDpiCanvas
          width={width}
          height={height}
          className="content__overlay"
          render={render}
        />
      )}
    </div>
  );
}

export default WindowOverlayCanvas;
