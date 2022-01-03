import React, { useRef, useState } from "react";

interface WindowProps {
  itemCount: number;
  buildItem: (index: number) => React.ReactElement;
  onVisibleChanged: (
    visibleStartIndex: number,
    visibleEndIndex: number
  ) => void;
}

function Window(props: WindowProps) {
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const [visibleEndIndex, setVisibleEndIndex] = useState(0);
  const itemsRef = useRef<Array<HTMLElement | null>>([]);

  // TODO: Update visible on first load

  const items = Array(props.itemCount)
    .fill(null)
    .map((_, index) =>
      React.cloneElement(props.buildItem(index), {
        ref: (el: HTMLElement | null) => (itemsRef.current[index] = el),
      })
    );

  // Option 1:
  // Pass refs to each item.
  // Start from current state and iterate to add all visible and remove invisible.
  // Find items that have y-coordinates overlap with [scrollTop, scrollTop + clientHeight]

  // Start index should satisfy this condition:
  // top of start item <= scrollTop && bottom of start item > scrollTop

  // End index should satisfy this condition:
  // top of end item < scrollTop + clientHeight && bottom of end item >= scrollTop + clientEnd

  return (
    <div
      style={{ height: "100%", overflow: "scroll" }}
      ref={(e) => {}}
      onScroll={(e) => {
        const topEdge = e.currentTarget.scrollTop;
        const bottomEdge = topEdge + e.currentTarget.clientHeight;

        console.log(itemsRef.current);

        // console.log(e.currentTarget.scrollTop, e.currentTarget.clientHeight)
        // Find items that have y-coordinates in [scrollTop, scrollTop + clientHeight]
        // Compare to existing visible items state.
        // If different, then call onVisibleChanged
      }}
    >
      {items}
    </div>
  );
}

export default Window;
