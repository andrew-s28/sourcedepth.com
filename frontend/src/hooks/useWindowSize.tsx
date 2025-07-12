import { useState, useEffect, useRef } from "react";

export function useWidth() {
  const [width, setWidth] = useState(10000);
  const didMount = useRef(false);

  useEffect(() => {
    if (!didMount.current) {
      // first width update is handled by script in the document itself, see initialTheme() below
      const storedWidth = localStorage.getItem("innerWidth");
      setWidth(Number(storedWidth ?? 10000));
      didMount.current = true;
      return;
    }

    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return { width: width };
}

export function useHeight() {
  const [height, setHeight] = useState(10000);
  const didMount = useRef(false);

  useEffect(() => {
    if (!didMount.current) {
      // first height update is handled by script in the document itself, see initialWindowSize() below
      const storedHeight = localStorage.getItem("innerHeight");
      setHeight(Number(storedHeight ?? 10000));
      didMount.current = true;
      return;
    }

    const handleResize = () => {
      setHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return { height: height };
}

export function initialWindowSize() {
  // this script sets theme on DOM load, before hydration
  // https://tanstack.com/router/latest/docs/framework/react/guide/document-head-management/#scripts
  return {
    children: `
      const width = window.innerWidth;
      const height = window.innerHeight;
      if (!("innerWidth" in localStorage)) {
        localStorage.setItem("innerWidth", width);
      }
      if (!("innerHeight" in localStorage)) {
        localStorage.setItem("innerHeight", height);
      }
    `,
  };
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
