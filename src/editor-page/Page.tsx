import { useCallback } from "react";
import HighDpiCanvas from "../common/HighDpiCanvas";
import { PdfPageHandle } from "../pdf-rendering";
import {
  useDocumentOperationsDispatch,
  useDocumentPageOperations,
} from "./DocumentOperationsContext";
import { PageOperationsProvider } from "./PageOperationsContext";
import PageOverlayCanvas from "./PageOverlayCanvas";

interface PageProps {
  pageNumber: number;
  pageHandle?: PdfPageHandle;
  defaultAspectRatio: number;
}

export function Page({
  pageNumber,
  pageHandle,
  defaultAspectRatio,
}: PageProps) {
  const pageOperations = useDocumentPageOperations(pageNumber);
  const documentOperationsDispatch = useDocumentOperationsDispatch();

  const defaultWidth = 800;

  if (pageHandle === undefined) {
    return (
      <PageContainer
        width={defaultWidth}
        height={defaultWidth / defaultAspectRatio}
      />
    );
  }

  return (
    <PageOperationsProvider
      state={pageOperations}
      dispatchState={(newState) => {
        documentOperationsDispatch({
          type: "UPDATE_PAGE_OPERATIONS",
          pageNumber: pageNumber,
          updatedOperations: newState,
        });
      }}
    >
      <RenderedPage width={defaultWidth} pageHandle={pageHandle} />
    </PageOperationsProvider>
  );
}

interface PageContainerProps {
  width: number;
  height: number;
  children?: React.ReactNode;
}

function PageContainer({ width, height, children }: PageContainerProps) {
  const style = { width: `${width}px`, height: `${height}px` };
  return (
    <div className="page-container" style={style}>
      {children}
    </div>
  );
}

interface RenderedPageProps {
  width: number;
  pageHandle: PdfPageHandle;
}

function RenderedPage({ width, pageHandle }: RenderedPageProps) {
  const height = width / pageHandle.aspectRatio;

  const renderPage = useCallback(
    (canvasContext) => {
      pageHandle.render(canvasContext);
    },
    [pageHandle]
  );

  return (
    <PageContainer width={width} height={height}>
      <HighDpiCanvas width={width} height={height} render={renderPage} />
      <PageOverlayCanvas
        width={width}
        height={height}
        pageWidth={pageHandle.width}
      />
    </PageContainer>
  );
}
