import { useRef, ReactNode } from "react";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  // eslint-disable-next-line no-unused-vars
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const didMount = useRef(false);

  useEffect(() => {
    // first render of theme is handled by script in the document itself, see initialTheme() below
    if (!didMount.current) {
      const storedTheme = localStorage.getItem(storageKey) as Theme | null;
      setTheme(storedTheme ?? defaultTheme);
      didMount.current = true;
      return;
    }

    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    // theme should be set by this point, but if not, fallback to system
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      console.log("System theme applied: ", systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeProviderContext);
  return context;
}

export function initialTheme() {
  // this script sets theme on DOM load, before hydration
  // https://tanstack.com/router/latest/docs/framework/react/guide/document-head-management/#scripts
  return {
    children: `
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (!("theme" in localStorage)) {
      localStorage.setItem("theme", prefersDark ? "dark" : "light");
    }
    document.documentElement.classList.toggle(
      "dark",
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) && prefersDark),
    );
    document.documentElement.classList.toggle(
      "light",
      localStorage.theme === "light" ||
      (!("theme" in localStorage) && !prefersDark),
    );
      `,
  };
}
