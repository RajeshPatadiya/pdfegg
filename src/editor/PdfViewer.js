import { useEffect, useState } from "react";
import PageContainer from "./PageContainer";

function PdfViewer({ pdfHandle }) {
    const [pageNumber, setPageNumber] = useState(1);
    const [loadedPages, setLoadedPages] = useState({});

    console.log(loadedPages);

    useEffect(() => {
        async function loadPage() {
            console.log(`load page ${pageNumber}`);
            const pdfPageHandle = await pdfHandle.getPage(pageNumber);
            setLoadedPages(loadedPages => {
                return { ...loadedPages, [pageNumber]: pdfPageHandle };
            });
        }
        loadPage();
    }, [pdfHandle, pageNumber]);

    const hasPrev = pageNumber > 1;
    function prevPage() {
        if (hasPrev) {
            setPageNumber(p => p - 1);
        }
    }

    const hasNext = pageNumber < pdfHandle.pageCount;
    function nextPage() {
        if (hasNext) {
            setPageNumber(p => p + 1);
        }
    }

    const pageHandle = loadedPages[pageNumber];

    return (
        <>
            <p>{pageNumber} / {pdfHandle.pageCount}</p>
            <button disabled={!hasPrev} onClick={prevPage}>Prev</button>
            <button disabled={!hasNext} onClick={nextPage}>Next</button>
            <br />
            {
                pageHandle === undefined
                    ? <p>Loading...</p>
                    : <PageContainer width="800" pageHandle={pageHandle} />

            }
        </>
    );
}

export default PdfViewer;