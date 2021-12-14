import { useCallback, useEffect, useState } from "react";
import PageContainer from "./PageContainer";

function PdfViewer({ pdfRenderer }) {
    const [pageNumber, setPageNumber] = useState(1);
    const [pageDimensions, setPageDimensions] = useState(null);

    useEffect(() => {
        async function updateDimensions() {
            console.log(`update dimensions for ${pageNumber}`);
            const dimensions = await pdfRenderer.getPageDimensions(pageNumber);
            setPageDimensions(dimensions);
        }
        updateDimensions();
        // await pdfRenderer.loadPage(pageNumber);
        // setLoaded(true);
        // pdfRenderer.isPageLoaded(pageNumber);
        // pdfRenderer.getPageDimensions(pageNumber); // sync
    }, [pdfRenderer, pageNumber]);

    const hasPrev = pageNumber > 1;
    function prevPage() {
        if (hasPrev) {
            setPageNumber(p => p - 1);
            setPageDimensions(null);
        }
    }

    const hasNext = pageNumber < pdfRenderer.pageCount;
    function nextPage() {
        if (hasNext) {
            setPageNumber(p => p + 1);
            setPageDimensions(null);
        }
    }

    const renderPage = useCallback(
        (canvasContext) => {
            pdfRenderer.renderPage(pageNumber, canvasContext);
        },
        [pdfRenderer, pageNumber],
    );

    return (
        <>
            <p>{pageNumber} / {pdfRenderer.pageCount}</p>
            <button disabled={!hasPrev} onClick={prevPage}>Prev</button>
            <button disabled={!hasNext} onClick={nextPage}>Next</button>
            <br />
            {
                pageDimensions === null
                    ? <p>Loading...</p>
                    : (
                        <PageContainer
                            width="800"
                            pageDimensions={pageDimensions}
                            renderPage={renderPage}
                        />
                    )
            }
        </>
    );
}

export default PdfViewer;