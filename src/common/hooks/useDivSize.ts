import React, { useCallback, useEffect, useRef, useState } from "react";

function useDivSize(): [React.RefObject<HTMLDivElement>, number?, number?] {
  const divRef = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState<number>();
  const [height, setHeight] = useState<number>();

  const updateSize = useCallback(() => {
    if (divRef.current === null) return;

    const { clientWidth, clientHeight } = divRef.current;

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

  return [divRef, width, height];
}

export default useDivSize;
