import { ReactNode, StrictMode } from "react";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
  useLocation,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary";
import Navbar from "~/components/Navbar";
import { NotFound } from "~/components/NotFound";
import appCss from "~/styles/app.css?url";
import { seo } from "~/utils/seo";
import { ThemeProvider, initialTheme } from "../components/ThemeProvider";
import { MotionConfig } from "framer-motion";
import Footer from "~/components/Footer";

export const Route = createRootRoute({
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
        description: `Personal website and blog for physical oceanographer and software developer Andrew Scherer.`,
      }),
    ],
    scripts: [initialTheme()],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "icon", href: "/favicon.ico" },
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
  return (
    <StrictMode>
      <html suppressHydrationWarning lang="en" className="antialiased">
        <head>
          <HeadContent />
        </head>
        <body suppressHydrationWarning>
          <ThemeProvider>
            <Navbar />
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
