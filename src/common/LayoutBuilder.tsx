import React, { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  buildLayout: (width: number, height: number) => React.ReactElement;
}

function LayoutBuilder({ buildLayout }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState<number>();
  const [height, setHeight] = useState<number>();

  const updateSize = useCallback(() => {
    if (containerRef.current === null) return;

    const { clientWidth, clientHeight } = containerRef.current;

    if (clientWidth !== width) {
      setWidth(clientWidth);
    }

    if (clientHeight !== height) {
      setHeight(clientHeight);
    }
  }, []);

  // Initialize size on mount.
  useEffect(updateSize, []);

  useEffect(() => {
    window.addEventListener("resize", updateSize);

    return () => {
      window.removeEventListener("resize", updateSize);
    };
  });

  return (
    <div ref={containerRef} style={{ height: "100%", width: "100%" }}>
      {width !== undefined &&
        height !== undefined &&
        buildLayout(width, height)}
    </div>
  );
}

export default LayoutBuilder;
