import React from "react";
import HighDpiCanvas from "../common/HighDpiCanvas";
import useDivSize from "../common/hooks/useDivSize";

interface Props {
  children: React.ReactElement;
}

function WindowOverlayCanvas({ children }: Props) {
  const [divRef, width, height] = useDivSize();

  return (
    <div ref={divRef} style={{ height: "100%", position: "relative" }}>
      {children}

      {width && height && (
        <HighDpiCanvas
          width={width}
          height={height}
          className="content__overlay"
          render={(context) => {
            context.fillRect(100, 100, 100, 100);
          }}
        />
      )}
    </div>
  );
}

export default WindowOverlayCanvas;
