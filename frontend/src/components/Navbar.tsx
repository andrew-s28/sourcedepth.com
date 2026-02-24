import DarkModeSwitch from "./DarkModeSwitch";
import GitHub from "./ui/GitHubMark";
import { Link, useLocation } from "@tanstack/react-router";
import { Accordion, Popover } from "radix-ui";
import { ChevronDown, MenuIcon } from "lucide-react";
import { Route as ProjectsRoute } from "~/routes/projects.index";
import { Route as BlogRoute } from "~/routes/blog.index";
import { Route as AboutRoute } from "~/routes/about";
import { cn } from "~/utils/utils";
import { useEffect, useState } from "react";

export interface NavbarProps {
  height: string;
}

const navStyles = {
  button: `
    font-bold
    text-lg
    h-[3rem]
    rounded
    w-30
    min-w-30
    transition-all
    dark:hover:bg-night-sky-700
    hover:bg-night-sky-300
    focus-visible:ring-blue-500
    outline-0
    focus-visible:ring-1
    flex
    items-center
    justify-center
  `,
  active: "font-bold text-lg bg-night-sky-200 dark:bg-night-sky-900",
  inactive: "font-normal text-lg",
  container: "w-full sticky top-0 bg-dawn-pink-100 dark:bg-night-sky-950 z-50",
  nav: "h-[4rem] p-0 items-center m-auto",
};

function BlogLinkButton({ categories }: { categories?: string[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = useLocation().pathname;
  const isActive = pathname.startsWith("/blog");

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return categories && categories.length > 0 ? (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger className="flex items-center justify-center h-full cursor-pointer outline-0 focus-visible:ring-1 focus-visible:ring-blue-500">
        <div className="flex items-center justify-center h-full cursor-pointer outline-0 focus-visible:ring-1 focus-visible:ring-blue-500">
          <div
            className={`${navStyles.button} ${isActive ? navStyles.active : navStyles.inactive}`}
          >
            Blog
          </div>
          <span className="sr-only">Toggle menu</span>
        </div>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="w-64 bg-dawn-pink-100 dark:bg-night-sky-950 p-2 rounded-lg shadow-xl z-50 border-night-sky-950 dark:border-dawn-pink-100 border-2"
          sideOffset={5}
        >
          <div className="flex items-center justify-center h-full cursor-pointer outline-0 focus-visible:ring-1 focus-visible:ring-blue-500">
            <div className="flex flex-col space-y-1 w-full">
              {categories.map((category) => (
                <Link
                  to={BlogRoute.to + `/${category.toLowerCase()}`}
                  className="px-4 py-2 rounded-md text-center capitalize hover:bg-night-sky-300 dark:hover:bg-night-sky-700"
                  activeProps={{ className: navStyles.active }}
                  key={category}
                  resetScroll
                >
                  {category}
                </Link>
              ))}
              <Link
                to={BlogRoute.to}
                className="px-4 py-2 hover:bg-night-sky-300 dark:hover:bg-night-sky-700 rounded-md text-center"
                activeOptions={{ exact: true }}
                activeProps={{ className: navStyles.active }}
                resetScroll
              >
                See All Posts
              </Link>
            </div>
          </div>
          <Popover.Arrow
            height={10}
            className="dark:fill-dawn-pink-100 fill-night-sky-950"
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  ) : (
    <Link
      to={BlogRoute.to}
      className={navStyles.button}
      resetScroll
      aria-label="Blog link"
      activeProps={{ className: navStyles.active }}
      inactiveProps={{ className: navStyles.inactive }}
    >
      Blog
    </Link>
  );
}

function BlogLinkDropdown({ categories }: { categories?: string[] }) {
  const pathname = useLocation().pathname;
  const isActive = pathname.startsWith("/blog");

  return (
    <Accordion.Root type="single" collapsible>
      <Accordion.Item value="blog" className="text-center">
        <Accordion.Header>
          <Accordion.Trigger
            className={cn(
              "w-full group",
              "px-4 py-2 rounded-md  dark:hover:bg-night-sky-700 hover:bg-night-sky-300 relative",
              isActive ? navStyles.active : navStyles.inactive,
            )}
          >
            Blog
            <ChevronDown
              className="absolute right-2 top-1/2 transform -translate-y-1/2 group-data-[state=open]:rotate-180 transition duration-200"
              size={24}
              aria-hidden
            />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="p-2 space-y-1">
          <div className="w-full bg-night-sky-950 dark:bg-dawn-pink-100 h-[1px] mx-auto mb-2" />
          {categories?.map((category) => (
            <Link
              key={category}
              to={BlogRoute.to + `/${category.toLowerCase()}`}
              className="block text-sm px-4 py-2 rounded-md text-center capitalize hover:bg-night-sky-300 dark:hover:bg-night-sky-700"
              activeProps={{ className: navStyles.active }}
              resetScroll
            >
              {category}
            </Link>
          ))}
          <Link
            to={BlogRoute.to}
            className="block text-sm px-4 py-2 rounded-md text-center hover:bg-night-sky-300 dark:hover:bg-night-sky-700"
            activeOptions={{ exact: true }}
            activeProps={{ className: navStyles.active }}
            resetScroll
          >
            See All Posts
          </Link>
          <div className="w-full bg-night-sky-950 dark:bg-dawn-pink-100 h-[1px] mx-auto mt-2" />
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}

export default function Navbar(
  { categories }: { categories?: string[] } = { categories: [] },
) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = useLocation().pathname;

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className={navStyles.container}>
      <nav
        className={cn(
          navStyles.nav,
          "justify-between px-5 grid-cols-3 max-w-6xl hidden md:grid-cols-[150px_1fr_150px] md:grid",
        )}
      >
        <Link
          to="/"
          inactiveProps={{ className: navStyles.inactive }}
          activeOptions={{ exact: true }}
          className="flex cursor-pointer items-center justify-center mx-1 px-1 py-0 m-0 size-[3rem] rounded-full bg-transparent shadow-none border-solid focus-visible:ring-1 focus-visible:ring-blue-500 hover:bg-night-sky-300 dark:hover:bg-night-sky-700 justify-self-start"
          resetScroll
          aria-label="Home page link"
        >
          <img src="/static/logo.svg" alt="Logo" className="h-8 dark:hidden" />
          <img
            src="/static/logo-light.svg"
            alt="Logo"
            className="h-8 hidden dark:inline"
          />
          <span className="sr-only">Home</span>
        </Link>
        <div className="align-middle grow-0 flex space-x-2 px-5 justify-self-stretch justify-center">
          <BlogLinkButton categories={categories?.sort()} />
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
        <div className="flex items-center justify-self-end">
          <div className="px-2">
            <GitHub githubLink={"https://github.com/andrew-s28/"} />
          </div>
          <div className="px-2">
            <DarkModeSwitch />
          </div>
        </div>
      </nav>
      <nav className={cn(navStyles.nav, "flex justify-center md:hidden")}>
        <div className="flex items-center justify-between w-full px-2">
          <Link
            to="/"
            inactiveProps={{ className: navStyles.inactive }}
            activeOptions={{ exact: true }}
            className="flex cursor-pointer items-center justify-center px-1 mx-4 py-0 m-0 size-[3rem] rounded-full bg-transparent shadow-none border-solid focus-visible:ring-1 focus-visible:ring-blue-500"
            resetScroll
          >
            <img
              src="/static/logo.svg"
              alt="Logo"
              className="h-8 dark:hidden"
            />
            <img
              src="/static/logo-light.svg"
              alt="Logo"
              className="h-8 hidden dark:inline"
            />
            <span className="sr-only">Home</span>
          </Link>

          <div className="align-middle justify-center grow-0 px-4">
            <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
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
                    <BlogLinkDropdown categories={categories} />
                    <Link
                      to={ProjectsRoute.to}
                      className="px-4 py-2 dark:hover:bg-night-sky-700 hover:bg-night-sky-300 rounded-md text-center"
                      activeProps={{ className: navStyles.active }}
                      resetScroll
                    >
                      Projects
                    </Link>
                    <Link
                      to={AboutRoute.to}
                      className="px-4 py-2 dark:hover:bg-night-sky-700 hover:bg-night-sky-300 dark:active:bg-night-sky-700 active:bg-night-sky-300 rounded-md text-center"
                      activeProps={{
                        className: navStyles.active,
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
    </div>
  );
}
