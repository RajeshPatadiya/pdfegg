import React, { useEffect, useRef, useState } from "react";

interface WindowProps {
  itemCount: number;
  buildItem: (index: number) => React.ReactElement;
  onVisibleChanged: (
    visibleStartIndex: number,
    visibleEndIndex: number
  ) => void;
}

interface VisibleRange {
  startIndex: number;
  endIndex: number;
}

function Window(props: WindowProps) {
  const [visibleRange, setVisibleRange] = useState<VisibleRange>({
    startIndex: 0,
    endIndex: 0,
  });

  const itemsRef = useRef<Array<HTMLElement>>([]);

  // TODO: Update visible on first load

  useEffect(() => {
    console.log(itemsRef.current);
  }, []);

  const children = Array(props.itemCount)
    .fill(null)
    .map((_, index) =>
      React.cloneElement(props.buildItem(index), {
        ref: (el: HTMLElement) => (itemsRef.current[index] = el),
      })
    );

  return (
    <div
      style={{ height: "100%", overflow: "scroll" }}
      onScroll={(e) => {
        // Validate pre-conditions:
        const preConditions = [itemsRef.current.length === props.itemCount];
        if (preConditions.includes(false)) {
          throw Error("Window: Invalid pre-conditions " + preConditions);
        }

        const newVisibleRange = getVisibleItemRange(
          e.currentTarget,
          itemsRef.current
        );

        if (
          newVisibleRange.startIndex !== visibleRange.startIndex ||
          newVisibleRange.endIndex !== visibleRange.endIndex
        ) {
          props.onVisibleChanged(
            newVisibleRange.startIndex,
            newVisibleRange.endIndex
          );
          setVisibleRange(newVisibleRange);
        }
      }}
    >
      {children}
    </div>
  );
}

function getVisibleItemRange(
  viewport: HTMLElement,
  items: HTMLElement[]
): VisibleRange {
  const viewportTop = viewport.scrollTop;
  const viewportBottom = viewportTop + viewport.clientHeight;

  function isItemVisible(item: HTMLElement): boolean {
    const itemTop = item.offsetTop - viewport.offsetTop;
    const itemBottom = itemTop + item.clientHeight;
    const invisible = itemBottom <= viewportTop || itemTop >= viewportBottom;
    return !invisible;
  }

  // TODO: Optimize the algorithm, most of the time visible range will remain unchanged
  const newStart = items.findIndex((item) => isItemVisible(item!));
  const newEnd =
    items.length -
    1 -
    items
      .slice()
      .reverse()
      .findIndex((item) => isItemVisible(item!));

  // Validate post-conditions:
  const postConditions = [
    isItemVisible(items[newStart]!),
    isItemVisible(items[newEnd]!),
    newStart === 0 || !isItemVisible(items[newStart - 1]!),
    newEnd === items.length - 1 || !isItemVisible(items[newEnd + 1]!),
  ];
  if (postConditions.includes(false)) {
    throw Error("Window: Invalid post-conditions " + postConditions);
  }

  return {
    startIndex: newStart,
    endIndex: newEnd,
  };
}

export default Window;
