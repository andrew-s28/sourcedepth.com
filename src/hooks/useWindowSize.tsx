import { useState, useEffect } from "react";

export const useWindowSize = (debounce: boolean = false) => {
  const [height, setHeight] = useState(10000);
  const [width, setWidth] = useState(10000);
  const [isLoaded, setIsLoaded] = useState(false);

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
    setIsLoaded(true);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, [debounce]);

  return { width: width, height: height, isLoaded: isLoaded };
};
