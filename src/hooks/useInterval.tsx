/*
  Modified from Dan Abramov's blog post:
  https://overreacted.io/making-setinterval-declarative-with-react-hooks/
*/

import { useEffect, useRef } from "react";

export function useInterval(callback: () => null, delay: number | null) {
  const savedCallback = useRef<() => null>(null);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (savedCallback.current !== null) {
        savedCallback.current();
      }
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => {
        clearInterval(id);
      };
    }
  }, [delay]);
}
