import HighDpiCanvas from "../common/HighDpiCanvas";
import PageOverlayCanvas from "./PageOverlayCanvas";

function PageContainer({ width, pageDimensions, renderPage }) {
    const height = width / pageDimensions.width * pageDimensions.height;
    const style = { width: `${width}px`, height: `${height}px` };

    return (
        <div className="page-container" style={style}>
            <HighDpiCanvas
                width={width}
                height={height}
                render={renderPage}
            />
            <PageOverlayCanvas
                width={width}
                height={height}
                pageWidth={pageDimensions.width}
            />
        </div>
    );
}

export default PageContainer;