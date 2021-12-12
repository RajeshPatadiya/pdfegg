import HighDpiCanvas from "./common/HighDpiCanvas";

function PdfPage({ width, aspectRatio, renderPage }) {
    return (
        <HighDpiCanvas width={width} height={width / aspectRatio} render={renderPage} />
    );
}

export default PdfPage;
