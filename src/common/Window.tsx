import React, { useEffect, useRef, useState } from "react";

interface WindowProps {
  children: React.ReactElement[];
  onVisibleChanged: (
    visibleStartIndex: number,
    visibleEndIndex: number
  ) => void;
}

interface VisibleRange {
  startIndex: number;
  endIndex: number;
}

function Window({ children, onVisibleChanged }: WindowProps) {
  const [visibleRange, setVisibleRange] = useState<VisibleRange>({
    startIndex: 0,
    endIndex: 0,
  });
  const viewportRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Array<HTMLElement>>([]);

  function updateVisibleRange(newVisibleRange: VisibleRange) {
    onVisibleChanged(newVisibleRange.startIndex, newVisibleRange.endIndex);
    setVisibleRange(newVisibleRange);
  }

  useEffect(() => {
    const initialVisibleRange = getVisibleItemRange(
      viewportRef.current!,
      itemsRef.current,
      visibleRange
    );
    updateVisibleRange(initialVisibleRange);
  }, []);

  return (
    <div
      ref={viewportRef}
      style={{ height: "100%", overflow: "scroll" }}
      onScroll={(e) => {
        console.assert(itemsRef.current.length === children.length);

        const newVisibleRange = getVisibleItemRange(
          e.currentTarget,
          itemsRef.current,
          visibleRange
        );

        if (
          newVisibleRange.startIndex !== visibleRange.startIndex ||
          newVisibleRange.endIndex !== visibleRange.endIndex
        ) {
          updateVisibleRange(newVisibleRange);
        }
      }}
    >
      {children.map((child, i) =>
        React.cloneElement(child, {
          ref: (el: HTMLElement) => (itemsRef.current[i] = el),
        })
      )}
    </div>
  );
}

function getVisibleItemRange(
  viewport: HTMLElement,
  items: HTMLElement[],
  prevVisibleRange: VisibleRange
): VisibleRange {
  const viewportTop = viewport.scrollTop;
  const viewportBottom = viewportTop + viewport.clientHeight;

  function getItemPosition(item: HTMLElement): {
    top: number;
    bottom: number;
  } {
    const top = item.offsetTop - viewport.offsetTop;
    const bottom = top + item.clientHeight;
    return { top, bottom };
  }

  function aboveViewport(itemIndex: number): boolean {
    const item = items[itemIndex];
    const { bottom } = getItemPosition(item);
    return bottom <= viewportTop;
  }

  function inViewport(itemIndex: number): boolean {
    return !aboveViewport(itemIndex) && !belowViewport(itemIndex);
  }

  function belowViewport(itemIndex: number): boolean {
    const item = items[itemIndex];
    const { top } = getItemPosition(item);
    return top >= viewportBottom;
  }

  let { startIndex, endIndex } = prevVisibleRange;

  if (aboveViewport(startIndex)) {
    while (startIndex < items.length - 1 && aboveViewport(startIndex)) {
      startIndex++;
    }
  } else {
    while (startIndex > 0 && !aboveViewport(startIndex - 1)) {
      startIndex--;
    }
  }

  if (belowViewport(endIndex)) {
    while (endIndex > 0 && belowViewport(endIndex)) {
      endIndex--;
    }
  } else {
    while (endIndex < items.length - 1 && !belowViewport(endIndex + 1)) {
      endIndex++;
    }
  }

  console.assert(inViewport(startIndex));
  console.assert(inViewport(endIndex));
  console.assert(startIndex === 0 || aboveViewport(startIndex - 1));
  console.assert(endIndex === items.length - 1 || belowViewport(endIndex + 1));

  return {
    startIndex: startIndex,
    endIndex: endIndex,
  };
}

export default Window;
