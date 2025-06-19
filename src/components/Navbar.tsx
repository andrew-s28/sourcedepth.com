import DarkModeSwitch from "./DarkModeSwitch";
import GitHub from "./ui/GitHubMark";
import { Link } from "@tanstack/react-router";
import { useWindowSize } from "~/hooks/useWindowSize";
import { Popover } from "radix-ui";
import { MenuIcon, HomeIcon } from "lucide-react";
import { Route as ProjectsRoute } from "~/routes/projects.index";
import { Route as BlogRoute } from "~/routes/blog.index";
import { Route as AboutRoute } from "~/routes/about";
import { cn } from "~/lib/utils";

export interface NavbarProps {
  height: string;
}

const navStyles = {
  button: `
    font-bold
    text-lg
    h-[3rem]
    rounded-full
    w-30
    transition-all
    dark:hover:bg-gray-600/20
    hover:bg-gray-300/50
    focus-visible:ring-blue-500
    outline-0
    focus-visible:ring-1
    flex
    items-center
    justify-center
  `,
  active: "font-bold text-lg",
  inactive: "font-normal text-lg",
  container: "w-full sticky top-0 bg-dawn-pink-100 dark:bg-night-sky-950 z-50",
  nav: "h-[4rem] p-0 items-center m-auto",
};

export default function Navbar() {
  const { width } = useWindowSize();
  return (
    <div className={navStyles.container}>
      {width >= 768 ? (
        <nav
          className={cn(
            navStyles.nav,
            "justify-between grid px-5 grid-cols-3 max-w-6xl"
          )}
        >
          <Link
            to="/"
            activeProps={{ className: navStyles.active }}
            inactiveProps={{ className: navStyles.inactive }}
            activeOptions={{ exact: true }}
            className="flex cursor-pointer items-center justify-center px-1 py-0 m-0 size-[3rem] rounded-full bg-transparent shadow-none border-solid focus-visible:ring-1 focus-visible:ring-blue-500 hover:bg-gray-600/20"
            resetScroll
          >
            <HomeIcon className="p-0" size={32} />
          </Link>
          <div className="align-middle grow-0 flex px-5">
            <Link
              to={BlogRoute.to}
              activeProps={{ className: navStyles.active }}
              inactiveProps={{ className: navStyles.inactive }}
              className={navStyles.button}
              resetScroll
            >
              Blog
            </Link>
            <Link
              to={ProjectsRoute.to}
              activeProps={{ className: navStyles.active }}
              inactiveProps={{ className: navStyles.inactive }}
              className={navStyles.button}
              resetScroll
            >
              Projects
            </Link>
            <Link
              to={AboutRoute.to}
              activeProps={{ className: navStyles.active }}
              inactiveProps={{ className: navStyles.inactive }}
              className={navStyles.button}
              resetScroll
            >
              About
            </Link>
          </div>
          <div className="flex items-center justify-end grow-0">
            <div className="px-2">
              <GitHub githubLink={"https://github.com/andrew-s28/"} />
            </div>
            <div className="px-2">
              <DarkModeSwitch />
            </div>
          </div>
        </nav>
      ) : (
        <nav className={cn(navStyles.nav, "flex justify-center")}>
          <div className="flex items-center justify-between w-full px-2">
            <Link
              to="/"
              activeProps={{ className: navStyles.active }}
              inactiveProps={{ className: navStyles.inactive }}
              activeOptions={{ exact: true }}
              className="flex cursor-pointer items-center justify-center px-1 py-0 m-0 size-[3rem] rounded-full bg-transparent shadow-none border-solid focus-visible:ring-1 focus-visible:ring-blue-500 hover:bg-gray-600/20"
              resetScroll
            >
              <HomeIcon className="p-0" size={32} />
            </Link>

            <div className="align-middle justify-center grow-0 px-4">
              <Popover.Root>
                <Popover.Trigger className="flex items-center justify-center h-full cursor-pointer outline-0 focus-visible:ring-1 focus-visible:ring-blue-500">
                  <div className="flex items-center justify-center h-full cursor-pointer outline-0 focus-visible:ring-1 focus-visible:ring-blue-500">
                    <MenuIcon className="w-full" size={32} />
                    <span className="sr-only">Toggle menu</span>
                  </div>
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Content
                    className="w-64 bg-dawn-pink-100 dark:bg-night-sky-950 p-2 rounded-lg shadow-xl z-50 border-night-sky-950 dark:border-dawn-pink-100 border-2"
                    sideOffset={5}
                  >
                    <div className="flex flex-col space-y-1">
                      <Link
                        to={BlogRoute.to}
                        className="px-4 py-2 hover:bg-muted rounded-md text-center"
                        activeProps={{
                          className:
                            "font-bold bg-dawn-pink-300 dark:bg-night-sky-900",
                        }}
                        resetScroll
                      >
                        Blog
                      </Link>
                      <Link
                        to={ProjectsRoute.to}
                        className="px-4 py-2 hover:bg-muted rounded-md text-center"
                        activeProps={{
                          className:
                            "font-bold bg-dawn-pink-300 dark:bg-night-sky-900",
                        }}
                        resetScroll
                      >
                        Projects
                      </Link>
                      <Link
                        to={AboutRoute.to}
                        className="px-4 py-2 hover:bg-muted rounded-md text-center"
                        activeProps={{
                          className:
                            "font-bold bg-dawn-pink-300 dark:bg-night-sky-900",
                        }}
                        resetScroll
                      >
                        About
                      </Link>
                      <div className="px-2 flex items-center justify-center">
                        <GitHub githubLink={"https://github.com/andrew-s28/"} />
                        <DarkModeSwitch />
                      </div>
                    </div>
                    <Popover.Arrow
                      height={10}
                      className="dark:fill-dawn-pink-100 fill-night-sky-950"
                    />
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}
