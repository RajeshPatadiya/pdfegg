import { useRef, useEffect } from "react";

interface HighDpiCanvasProps {
  width: number;
  height: number;
  render: (canvasContext: CanvasRenderingContext2D) => void;
}

function HighDpiCanvas({
  width,
  height,
  render,
  ...props
}: HighDpiCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const dpr = window.devicePixelRatio || 1;
  const canvasWidth = width * dpr;
  const canvasHeight = height * dpr;
  const canvasStyle = { width: `${width}px`, height: `${height}px` };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) throw Error("Failed to get canvas from ref.");
    const context = canvas.getContext("2d");
    if (context === null) throw Error("Failed to get context from canvas.");

    context.clearRect(0, 0, canvas.width, canvas.height);
    render(context);
  }, [canvasWidth, canvasHeight, render]);

  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      style={canvasStyle}
      {...props}
    />
  );
}

export default HighDpiCanvas;
