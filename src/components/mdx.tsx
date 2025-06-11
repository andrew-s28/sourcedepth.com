/*
Component overrides for the default MDX components
https://mdxjs.com/docs/using-mdx/#components
*/

import { Link, useMatch } from "@tanstack/react-router";
import { ReactNode, useState, useRef, useMemo } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import { getMDXComponent } from "mdx-bundler/client";

function Paragraph({ children }: { children: ReactNode }) {
  return (
    <p className="block me-1 text-night-sky-950 dark:text-dawn-pink-100 text-pretty py-3 text-base/loose">
      {children}
    </p>
  );
}

export function FancyLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  // Check if the link is external
  const isExternal = useMemo(() => {
    if (!href) return false;

    try {
      // If it's a relative URL, it's internal
      if (href.startsWith("/") || href.startsWith("#")) return false;

      // If it has a different domain than the current one, it's external
      const url = new URL(href);
      return url.host !== window.location.host;
    } catch {
      // If URL parsing fails, treat as internal link
      return false;
    }
  }, [href]);

  return (
    <>
      <a
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noreferrer" : undefined}
        href={href}
        className="text-night-sky-950 dark:text-dawn-pink-100 font-semibold border-b-2 border-blue-800 hover:border-0 transition-all duration-50"
      >
        {children}
        {isExternal && (
          <span className="inline-flex align-middle">
            <ExternalLink size={16} className="mb-0.5" />
          </span>
        )}
      </a>
    </>
  );
}

function Pre({ children }: { children: ReactNode }) {
  const [isCopied, setIsCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const handleCopy = async () => {
    if (!preRef.current) return;

    const textContent = preRef.current.textContent || "";

    try {
      await navigator.clipboard.writeText(textContent);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy code to clipboard", error);
    }
  };

  return (
    <div className="relative group py-4">
      <pre
        ref={preRef}
        className="overflow-x-auto bg-gray-100 dark:bg-gray-800 p-4 rounded-md border border-night-sky-950 dark:border-dawn-pink-100"
      >
        {children}
      </pre>
      <button
        onClick={() => {
          void handleCopy();
        }}
        className="absolute top-6 right-2 p-1.5 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 cursor-pointer"
        aria-label={isCopied ? "Copied!" : "Copy code"}
        title={isCopied ? "Copied!" : "Copy code"}
      >
        <div className="relative h-4 w-4">
          <Copy
            size={16}
            className={`absolute transition-all duration-300 ${
              isCopied ? "opacity-0 scale-50" : "opacity-100 scale-100"
            } text-gray-500 dark:text-gray-300`}
          />
          <Check
            size={16}
            className={`absolute transition-all duration-300 ${
              isCopied ? "opacity-100 scale-100" : "opacity-0 scale-50"
            } text-green-500`}
          />
        </div>
      </button>
    </div>
  );
}

function Header({
  children,
  type,
}: {
  children: ReactNode;
  type: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}) {
  if (typeof children !== "string") {
    throw new Error("Header1 component requires a string child");
  }
  const pathname = useMatch({ strict: false, select: (s) => s.pathname });
  const id = children.replace(/\s+/g, "-").toLowerCase();
  const headerStyles = {
    h1: "text-4xl font-bold",
    h2: "text-3xl font-semibold",
    h3: "text-2xl font-semibold",
    h4: "text-xl font-semibold",
    h5: "text-lg font-semibold",
    h6: "text-base font-semibold",
  };
  return (
    <div className="flex py-2">
      <Link to={pathname} hash={id} hashScrollIntoView={true}>
        <h1
          id={id}
          className={`${headerStyles[type]} text-pretty scroll-mt-16 text-night-sky-950 dark:text-dawn-pink-100 after:content-['#'] after:ml-2 after:text-night-sky-800 dark:after:text-dawn-pink-100 after:font-mono after:opacity-0 hover:after:opacity-80 transition-opacity duration-200 cursor-pointer`}
        >
          {children}
        </h1>
      </Link>
    </div>
  );
}

function Header1({ children }: { children: ReactNode }) {
  return Header({ children, type: "h1" });
}
function Header2({ children }: { children: ReactNode }) {
  return Header({ children, type: "h2" });
}
function Header3({ children }: { children: ReactNode }) {
  return Header({ children, type: "h3" });
}
function Header4({ children }: { children: ReactNode }) {
  return Header({ children, type: "h4" });
}
function Header5({ children }: { children: ReactNode }) {
  return Header({ children, type: "h5" });
}
function Header6({ children }: { children: ReactNode }) {
  return Header({ children, type: "h6" });
}

function BlockQuote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="border-l-4 border-blue-800 dark:border-blue-700 bg-gray-100 dark:bg-gray-800 px-4 py-3 my-4 rounded-r-md text-night-sky-900 dark:text-dawn-pink-200 italic">
      <div className="text-pretty">{children}</div>
    </blockquote>
  );
}

function Image({ src, alt }: { src: string; alt: string }) {
  // className = className ?
  const [loading, setLoading] = useState(true);
  return (
    <div className="relative w-full h-full flex justify-center items-center">
      <img
        src={src}
        alt={alt}
        className="rounded-lg shadow-md my-5 mx-auto min-w-[200px] w-2/3 h-auto"
        onLoad={() => {
          setLoading(false);
        }}
        style={{
          display: "block",
          opacity: loading ? 0 : 1,
          transition: "opacity 0.3s ease-in-out",
        }}
      />
      <div
        className="rounded-lg shadow-md my-5 mx-auto min-w-[200px] bg-gray-500/70 dark:bg-gray-900/70 w-2/3 animate-pulse"
        style={{
          height: "100%",
          position: "absolute",
          backgroundColor: "rgba(209, 213, 219, 0.75)",
          display: loading ? "block" : "none",
        }}
      />
    </div>
  );
}

export function MDX({ code }: { code: string }) {
  const Component = useMemo(() => getMDXComponent(code), [code]);
  return (
    <Component
      components={{
        a: FancyLink,
        h1: Header1,
        h2: Header2,
        h3: Header3,
        h4: Header4,
        h5: Header5,
        h6: Header6,
        pre: Pre,
        p: Paragraph,
        Image,
        blockquote: BlockQuote,
      }}
    />
  );
}
