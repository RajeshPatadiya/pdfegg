import React, { useCallback } from "react";
import HighDpiCanvas from "../common/HighDpiCanvas";
import Drawable from "../pdf-modification/drawables/Drawable";
import { PdfPageHandle } from "../pdf-rendering";
import { useDocumentPageDrawables } from "./DocumentOperationsContext";

interface PageProps {
  pageNumber: number;
  pageHandle: PdfPageHandle | null;
  width: number;
  fallbackAspectRatio: number;
  previewDrawable?: Drawable;
}

export const Page = React.memo(
  React.forwardRef<HTMLDivElement, PageProps>(
    (
      { pageNumber, pageHandle, width, fallbackAspectRatio, previewDrawable },
      ref
    ) => {
      const pageDrawables = useDocumentPageDrawables(pageNumber);

      console.log("render");

      if (pageHandle === null) {
        return (
          <PageContainer
            ref={ref}
            width={width}
            height={width / fallbackAspectRatio}
          />
        );
      }

      return (
        <RenderedPage
          ref={ref}
          width={width}
          pageHandle={pageHandle}
          drawables={
            previewDrawable
              ? [...pageDrawables, previewDrawable]
              : pageDrawables
          }
        />
      );
    }
  )
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
          drawable.drawOnCanvas(context, pageHandle.size.width)
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
