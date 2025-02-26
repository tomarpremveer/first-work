import { useRef, useCallback } from "react";

export const useDebounce = (
  callback: (...args: any[]) => void,
  delay: number
) => {
  const timeoutRef = useRef<number | null>(null);

  return useCallback(
    (...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
};
