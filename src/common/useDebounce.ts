import { useState } from "react";

type DebounceFunction = (callback: () => void) => void;

function useDebounce(ms: number): DebounceFunction {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();

  const debounce: DebounceFunction = (callback) => {
    if (timeoutId) clearTimeout(timeoutId);
    const newTimeoutId = setTimeout(callback, ms);
    setTimeoutId(newTimeoutId);
  };

  return debounce;
}

export default useDebounce;
