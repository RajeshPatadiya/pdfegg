import { useRef, useEffect } from 'react';

function PdfPage(props) {
    const canvasRef = useRef();
    const { width, render } = props;

    useEffect(() => {
        render(canvasRef.current);
    }, [width, render]);

    return (
        <canvas ref={canvasRef} style={{ width: `${width}px` }} />
    );
}

export default PdfPage;