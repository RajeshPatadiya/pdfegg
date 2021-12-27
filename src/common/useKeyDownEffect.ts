import { useEffect } from "react";

type KeyCombination = {
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  key: string;
};

function sameCombination(a: KeyCombination, b: KeyCombination): boolean {
  return (
    a.key === b.key &&
    (a.ctrl || false) === (b.ctrl || false) &&
    (a.alt || false) === (b.alt || false) &&
    (a.shift || false) === (b.shift || false)
  );
}

function useKeyDownEffect(
  triggerCombination: KeyCombination,
  callback: () => void
): void {
  const keyListener = (e: KeyboardEvent) => {
    const currentCombination: KeyCombination = {
      ctrl: e.ctrlKey || e.metaKey,
      alt: e.altKey,
      shift: e.shiftKey,
      key: e.key,
    };

    if (sameCombination(currentCombination, triggerCombination)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", keyListener);

    return () => {
      document.removeEventListener("keydown", keyListener);
    };
  });
}

export default useKeyDownEffect;
