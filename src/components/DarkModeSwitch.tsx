import Sun from "./ui/Sun.js";
import Moon from "./ui/Moon.js";
import { Button } from "@/components/ui/button";
import { useTheme } from "./ThemeProvider";

export default function DarkModeSwitch() {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      onClick={() => {
        setTheme(theme === "dark" ? "light" : "dark");
      }}
      aria-label="Light/Dark Mode Toggle"
      className="flex cursor-pointer items-center justify-center px-1 py-0 m-0 size-[3rem] rounded-full bg-transparent shadow-none border-solid focus-visible:ring-1 focus-visible:ring-blue-500 hover:bg-gray-600/20"
    >
      <div className="flex items-center justify-center relative m-auto">
        <Sun className="absolute size-[2rem] p-0 m-0 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute size-[2rem] p-0 m-0 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100 aria-hidden " />
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
