// src/routes/__root.tsx
/// <reference types="vite/client" />

import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
  useLocation,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { MotionConfig } from "framer-motion";
import { ReactNode, StrictMode } from "react";
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary";
import Footer from "~/components/Footer";
import Navbar from "~/components/Navbar";
import { NotFound } from "~/components/NotFound";
import appCss from "~/styles/app.css?url";
import { fetchMDX } from "~/utils/mdx-fetcher";
import { seo } from "~/utils/seo";
import { initialTheme, ThemeProvider } from "../components/ThemeProvider";

export const Route = createRootRoute({
  loader: async () => {
    const categories = await fetchMDX({ data: { directory: "posts" } });
    return { categories };
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, maximum-scale=1",
      },
      ...seo({
        title: "Andrew Scherer",
        description:
          "Personal website and blog for physical oceanographer and software developer Andrew Scherer. Find out about my professional history, publications, and interests in oceanography and software development.",
        keywords:
          "Andrew, Scherer, Andrew Scherer, Andrew Scherer website, Andrew Scherer blog, Andrew Scherer oceanography, Andrew Scherer software developer, oceanography, software development, personal website, blog, tech, technology, science, ocean science, physical oceanography, software engineering, programming, coding, web development",
      }),
    ],
    scripts: [initialTheme()],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/npm/katex@0.16.33/dist/katex.min.css",
        integrity:
          "sha384-fgYS3VC1089n2J3rVcEbXDHlnDLQ9B2Y1hvpQ720q1NvxCduQqT4JoGc4u2QCnzE",
        crossOrigin: "anonymous",
      },
      // For iPhone
      {
        rel: "apple-touch-icon",
        type: "image/png",
        sizes: "180x180",
        href: "/public/favicon-180x180.png",
      },
      // For iPad
      {
        rel: "apple-touch-icon",
        type: "image/png",
        sizes: "167x167",
        href: "/public/favicon-167x167.png",
      },
      // For Google and Android
      {
        rel: "icon",
        type: "image/png",
        sizes: "192x192",
        href: "/public/favicon-192x192.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "48x48",
        href: "/public/favicon-48x48.png",
      },
      // For all browsers
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/public/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/public/favicon-16x16.png",
      },
      { rel: "icon", href: "/public/favicon.ico" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Noto+Sans+Mono:wght@100..900&family=Noto+Sans:ital,wght@0,100..900;1,100..900&family=Noto+Serif:ital,wght@0,100..900;1,100..900&display=swap",
      },
    ],
  }),
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  const pathname = useLocation().pathname;
  const categories = Route.useLoaderData()
    .categories.frontmatters.map((fm) => fm.tags)
    .flat()
    .filter((value, index, self) => self.indexOf(value) === index);

  return (
    <StrictMode>
      <html suppressHydrationWarning lang="en" className="antialiased">
        <head>
          <HeadContent />
        </head>
        <body
          suppressHydrationWarning
          className="bg-dawn-pink-100 dark:bg-night-sky-950 text-night-sky-950 dark:text-dawn-pink-100"
        >
          <ThemeProvider>
            <Navbar categories={categories} />
            <hr />
            <MotionConfig reducedMotion="user">{children}</MotionConfig>
            <TanStackRouterDevtools position="bottom-right" />
            <Footer pathname={pathname} />
          </ThemeProvider>
          <Scripts />
        </body>
      </html>
    </StrictMode>
  );
}
