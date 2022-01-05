import React, { useRef, useState } from "react";

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

  const itemsRef = useRef<Array<HTMLElement | null>>([]);

  // TODO: Update visible on first load

  const items = Array(props.itemCount)
    .fill(null)
    .map((_, index) =>
      React.cloneElement(props.buildItem(index), {
        ref: (el: HTMLElement | null) => (itemsRef.current[index] = el),
      })
    );

  return (
    <div
      style={{ height: "100%", overflow: "scroll" }}
      onScroll={(e) => {
        const viewport = e.currentTarget;
        const viewportTop = viewport.scrollTop;
        const viewportBottom = viewportTop + viewport.clientHeight;
        const items = itemsRef.current;

        function isItemVisible(item: HTMLElement): boolean {
          const itemTop = item.offsetTop - viewport.offsetTop;
          const itemBottom = itemTop + item.clientHeight;
          const invisible =
            itemBottom <= viewportTop || itemTop >= viewportBottom;
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

        // invisible or nothing
        // visible item <- start
        // ...
        // visible item <- end
        // invisible item or nothing

        if (
          newStart !== visibleRange.startIndex ||
          newEnd !== visibleRange.endIndex
        ) {
          props.onVisibleChanged(newStart, newEnd);
          setVisibleRange({ startIndex: newStart, endIndex: newEnd });
        }
      }}
    >
      {items}
    </div>
  );
}

export default Window;
