import React, { useEffect } from "react";

const useClickOutsideEffect = (
  ignoreRefs: React.RefObject<HTMLElement>[],
  callback: () => void
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const node = event.target as Node;
      for (let ref of ignoreRefs) {
        if (!ref.current || ref.current.contains(node)) {
          return;
        }
      }
      callback();
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ignoreRefs, callback]);
};

export default useClickOutsideEffect;
