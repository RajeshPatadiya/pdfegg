import { useRef, useEffect } from 'react';

function HighDpiCanvas({ width, height, render, ...props }) {
    const canvasRef = useRef();

    const dpr = window.devicePixelRatio || 1;
    const canvasWidth = width * dpr;
    const canvasHeight = height * dpr;
    const canvasStyle = { width: `${width}px`, height: `${height}px` };

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
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