import { useEffect, useState } from "react";

export function useWidth() {
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const handleResize = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWidth(window.innerWidth);
      }, 300); // Adjust debounce delay as needed
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return { width: width };
}

export function useHeight() {
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const handleResize = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setHeight(window.innerHeight);
      }, 300); // Adjust debounce delay as needed
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return { height: height };
}

export const useWindowSize = (debounce: boolean = false) => {
  const [height, setHeight] = useState(10000);
  const [width, setWidth] = useState(10000);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const handleResize = () => {
      if (debounce) {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setWidth(window.innerWidth);
          setHeight(window.innerHeight);
        }, 300); // Adjust debounce delay as needed
      } else {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, [debounce]);

  return { width: width, height: height };
};
