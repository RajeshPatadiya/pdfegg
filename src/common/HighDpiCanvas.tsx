import { useRef, useEffect, MouseEventHandler } from "react";

interface HighDpiCanvasProps {
  width: number;
  height: number;
  render: (canvasContext: CanvasRenderingContext2D) => void;
  onMouseDown?: MouseEventHandler<HTMLCanvasElement>;
  onMouseMove?: MouseEventHandler<HTMLCanvasElement>;
  onMouseUp?: MouseEventHandler<HTMLCanvasElement>;
  onMouseLeave?: MouseEventHandler<HTMLCanvasElement>;
}

function HighDpiCanvas({
  width,
  height,
  render,
  ...eventHandlers
}: HighDpiCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const dpr = window.devicePixelRatio || 1;
  const canvasWidth = width * dpr;
  const canvasHeight = height * dpr;
  const canvasStyle = { width: `${width}px`, height: `${height}px` };

  useEffect(() => {
    const canvas = canvasRef.current!;
    const context = canvas.getContext("2d")!;

    context.clearRect(0, 0, canvas.width, canvas.height);
    render(context);
  }, [canvasWidth, canvasHeight, render]);

  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      style={canvasStyle}
      {...eventHandlers}
    />
  );
}

export default HighDpiCanvas;
