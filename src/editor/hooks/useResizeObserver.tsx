import { useCallback } from "react";

export function useResizeObserver(
  callback: (entry: ResizeObserverEntry) => void
) {
  const observerRef = useCallback(
    (node: Element | null) => {
      if (node) {
        const resizeObserver = new ResizeObserver((entries) => {
          entries.forEach(callback);
        });

        resizeObserver.observe(node);

        return () => {
          resizeObserver.disconnect();
        };
      }
    },
    [callback]
  );

  return observerRef;
}
