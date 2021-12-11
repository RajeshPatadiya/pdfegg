import { useRef, useEffect } from 'react';

function HighDpiCanvas({ width, height, render }) {
    const canvasRef = useRef();

    const canvasWidth = width * window.devicePixelRatio;
    const canvasHeight = height * window.devicePixelRatio;
    const canvasStyle = { width: `${width}px`, height: `${height}px` };

    useEffect(() => {
        const context = canvasRef.current.getContext('2d');
        render(context);
    }, [canvasWidth, canvasHeight, render]);

    return (
        <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            style={canvasStyle}
        />
    );
}

export default HighDpiCanvas;