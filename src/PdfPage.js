import HighDpiCanvas from "./HighDpiCanvas";

function PdfPage({ width, height, renderPage }) {
    const containerStyle = { width: `${width}px`, height: `${height}px` };

    return (
        <div className="page-container" style={containerStyle}>
            <HighDpiCanvas width={width} height={height} render={renderPage} />
        </div>
    );
}

export default PdfPage;
