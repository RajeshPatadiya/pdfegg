import React, { useEffect, useState } from "react";

interface Props {
  children: React.ReactElement[];
  afterChildren: React.ReactElement[];
  viewerRef: React.RefObject<HTMLDivElement>;
  itemsRef: React.MutableRefObject<HTMLElement[]>;
  onVisibleChanged: (
    visibleStartIndex: number,
    visibleEndIndex: number
  ) => void;
}

interface VisibleRange {
  startIndex: number;
  endIndex: number;
}

function Viewer({
  children,
  afterChildren,
  viewerRef,
  itemsRef,
  onVisibleChanged,
}: Props) {
  const [visibleRange, setVisibleRange] = useState<VisibleRange>({
    startIndex: 0,
    endIndex: 0,
  });

  function updateVisibleRange(newVisibleRange: VisibleRange) {
    onVisibleChanged(newVisibleRange.startIndex, newVisibleRange.endIndex);
    setVisibleRange(newVisibleRange);
  }

  useEffect(() => {
    const initialVisibleRange = getVisibleItemRange(
      viewerRef.current!,
      itemsRef.current,
      visibleRange
    );
    updateVisibleRange(initialVisibleRange);
  }, []);

  return (
    <div
      ref={viewerRef}
      style={{ height: "100%", overflow: "scroll", position: "relative" }}
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
      {afterChildren}
    </div>
  );
}

function getVisibleItemRange(
  viewer: HTMLElement,
  items: HTMLElement[],
  prevVisibleRange: VisibleRange
): VisibleRange {
  const viewportTop = viewer.scrollTop;
  const viewportBottom = viewportTop + viewer.clientHeight;

  function getItemPosition(item: HTMLElement): {
    top: number;
    bottom: number;
  } {
    const top = item.offsetTop - viewer.offsetTop;
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

export default Viewer;
