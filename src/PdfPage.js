import HighDpiCanvas from "./common/HighDpiCanvas";

function PdfPage({ width, aspectRatio, pageNumber, renderPage }) {
    return (
        <HighDpiCanvas
            width={width}
            height={width / aspectRatio}
            render={(context) => renderPage(pageNumber, context)}
        />
    );
}

export default PdfPage;
