import React, { useCallback } from "react";
import HighDpiCanvas from "../common/HighDpiCanvas";
import Drawable from "../pdf-modification/drawables/Drawable";
import { PdfPageHandle } from "../pdf-rendering";
import { useDocumentPageDrawables } from "./DocumentOperationsContext";

interface PageProps {
  pageNumber: number;
  pageHandle: PdfPageHandle | null;
  defaultAspectRatio: number;
}

export const Page = React.forwardRef<HTMLDivElement, PageProps>(
  ({ pageNumber, pageHandle, defaultAspectRatio }, ref) => {
    const pageDrawables = useDocumentPageDrawables(pageNumber);

    const defaultWidth = 800;

    if (pageHandle === null) {
      return (
        <PageContainer
          ref={ref}
          width={defaultWidth}
          height={defaultWidth / defaultAspectRatio}
        />
      );
    }

    return (
      <RenderedPage
        ref={ref}
        width={defaultWidth}
        pageHandle={pageHandle}
        drawables={pageDrawables}
      />
    );
  }
);

interface PageContainerProps {
  width: number;
  height: number;
  children?: React.ReactNode;
}

const PageContainer = React.forwardRef<HTMLDivElement, PageContainerProps>(
  ({ width, height, children }, ref) => {
    const style = { width: `${width}px`, height: `${height}px` };
    return (
      <div ref={ref} className="page-container" style={style}>
        {children}
      </div>
    );
  }
);

interface RenderedPageProps {
  width: number;
  pageHandle: PdfPageHandle;
  drawables: Drawable[];
}

const RenderedPage = React.forwardRef<HTMLDivElement, RenderedPageProps>(
  ({ width, pageHandle, drawables }, ref) => {
    const height = width / pageHandle.aspectRatio;

    const renderPage = useCallback(
      (canvasContext) => {
        pageHandle.render(canvasContext);
      },
      [pageHandle]
    );

    const renderDrawables = useCallback(
      (context) => {
        drawables.forEach((drawable) =>
          drawable.drawOnCanvas(context, pageHandle.width)
        );
      },
      [drawables, pageHandle]
    );

    return (
      <PageContainer ref={ref} width={width} height={height}>
        <HighDpiCanvas
          width={width}
          height={height}
          render={renderPage}
          preScaleRender={false}
        />
        <HighDpiCanvas
          width={width}
          height={height}
          render={renderDrawables}
          preScaleRender={false}
        />
      </PageContainer>
    );
  }
);
