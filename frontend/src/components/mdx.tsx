/*
Component overrides for the default MDX components
https://mdxjs.com/docs/using-mdx/#components
*/

import { Link, useMatch } from "@tanstack/react-router";
import { Check, Copy, ExternalLink } from "lucide-react";
import { getMDXComponent } from "mdx-bundler/client";
import { Popover } from "radix-ui";
import {
  Children,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { LenticularClouds } from "./LenticularClouds";
import { NitratePlot } from "./NitratePlot";
import { Presentation, Publication } from "./Publications";
import { AllLogos, WebsiteStackLogos } from "./ui/Logos";

type TextChild = string | boolean | undefined | null;
type NumberedContentProps = {
  number: number;
  children: ReactNode;
};
type FootnotesWrapperProps = {
  children: ReactNode;
};

export function Paragraph({ children }: { children: ReactNode }) {
  return (
    <p className="block me-1 text-night-sky-950 dark:text-dawn-pink-100 text-pretty py-3 text-base/7">
      {children}
    </p>
  );
}

export function FancyLink({
  href,
  children,
}: {
  href: string;
  children: TextChild;
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
      // If URL parsing fails, treat as external link
      return true;
    }
  }, [href]);

  let lastWord = "";
  let leadingWords = "";
  if (typeof children === "string") {
    lastWord = children.split(" ").pop() || "";
    leadingWords = children.split(" ").slice(0, -1).join(" ") || "";
  }

  return (
    <a
      target={isExternal ? "_blank" : ""}
      rel={isExternal ? "noreferrer" : ""}
      href={href}
      className="text-night-sky-950 dark:text-dawn-pink-100 font-semibold border-b-2 border-blue-800 hover:border-0 transition-all duration-50"
    >
      {leadingWords}{" "}
      <span className="inline-block whitespace-nowrap">
        {lastWord}
        {isExternal && (
          <span className="inline-flex align-middle ml-1">
            <span className="sr-only">External link</span>
            <ExternalLink size={16} className="mb-0.5" />
          </span>
        )}{" "}
      </span>
    </a>
  );
}

export function Pre({ children }: { children: ReactNode }) {
  const [isCopied, setIsCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  // highlight code lines based on hovering another element
  // code and the hoverable element must share the same parent element with the attribute "code-hover-highlight"
  useEffect(() => {
    const highlighter = containerRef.current?.closest<HTMLElement>(
      "[data-code-hover-highlight]"
    );
    if (!highlighter) return;

    const lines = preRef.current?.querySelectorAll<HTMLElement>("span[line]");
    lines?.forEach((line) => {
      line.classList.add("transition-all", "duration-150");
    });

    const highlightClasses = [
      "!bg-blue-500/15",
      "border-l-4",
      "border-blue-500",
    ];

    const updateHighlight = (event: Event) => {
      const target = event.target;
      const item =
        target instanceof Element
          ? target.closest<HTMLElement>("[data-code-line]")
          : null;
      const lineNumber = item?.dataset.codeLine;

      lines?.forEach((line) => {
        const isHighlighted = line.getAttribute("line") === lineNumber;
        highlightClasses.forEach((className) => {
          line.classList.toggle(className, isHighlighted);
        });
      });
    };

    highlighter.addEventListener("pointerover", updateHighlight);
    highlighter.addEventListener("focusin", updateHighlight);
    highlighter.addEventListener("pointerleave", updateHighlight);
    highlighter.addEventListener("focusout", updateHighlight);
    return () => {
      highlighter.removeEventListener("pointerover", updateHighlight);
      highlighter.removeEventListener("focusin", updateHighlight);
      highlighter.removeEventListener("pointerleave", updateHighlight);
      highlighter.removeEventListener("focusout", updateHighlight);
    };
  }, []);

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
    <div ref={containerRef} className="relative group py-4">
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

export function Header({
  children,
  type,
}: {
  children: TextChild;
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

export function Header1({ children }: { children: TextChild }) {
  return Header({ children, type: "h1" });
}
export function Header2({ children }: { children: TextChild }) {
  return Header({ children, type: "h2" });
}
export function Header3({ children }: { children: TextChild }) {
  return Header({ children, type: "h3" });
}
export function Header4({ children }: { children: TextChild }) {
  return Header({ children, type: "h4" });
}
export function Header5({ children }: { children: TextChild }) {
  return Header({ children, type: "h5" });
}
export function Header6({ children }: { children: TextChild }) {
  return Header({ children, type: "h6" });
}

export function BlockQuote({ children }: { children: TextChild }) {
  return (
    <blockquote className="border-l-4 border-blue-800 dark:border-blue-700 bg-gray-100 dark:bg-gray-800 px-4 py-3 my-4 rounded-r-md text-night-sky-900 dark:text-dawn-pink-200 italic">
      <div className="text-pretty">{children}</div>
    </blockquote>
  );
}

export function Image({
  src,
  alt,
  width,
  height,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
}) {
  // className = className ?
  const [loading, setLoading] = useState(true);
  src = src.startsWith("http") ? src : `/static${src}`;
  return (
    <>
      <img
        src={src}
        alt={alt}
        className="rounded-lg shadow-md my-5 mx-auto min-w-50 w-2/3 h-auto bg-gray-500"
        width={width}
        height={height}
        onError={() => {
          setLoading(false);
        }}
        onLoad={() => {
          setLoading(false);
        }}
        style={{
          display: "block",
          opacity: loading ? 0 : 1,
          transition: "opacity 1s ease-in-out",
        }}
      />
      <img
        className="rounded-lg shadow-md my-5 mx-auto min-w-50 w-2/3 h-auto bg-gray-500/70 dark:bg-gray-900/70 animate-pulse"
        style={{
          position: "absolute",
          display: loading ? "block" : "none",
        }}
        width={width}
        height={height}
      />
    </>
  );
}

export function FigureWithCaption({
  src,
  alt,
  width,
  height,
  caption,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
}) {
  return (
    <figure>
      <Image src={src} alt={alt} width={width} height={height} />
      <figcaption className="text-sm text-center -mt-5 mb-5 mx-auto min-w-50 w-2/3 h-auto opacity-70">
        <em>{caption}</em>
      </figcaption>
    </figure>
  );
}

export function List({ children }: { children: ReactNode }) {
  return (
    <div className="block mr-1">
      <ul className="list-disc list-inside pl-4">{children}</ul>
    </div>
  );
}

export function OrderedList({ children }: { children: ReactNode }) {
  return (
    <div className="block mr-1">
      <ol className="list-decimal list-inside pl-4">{children}</ol>
    </div>
  );
}

export function ListItem({ children }: { children: ReactNode }) {
  const normalizedChildren = Children.toArray(children).flatMap(
    (child, index) => {
      if (index !== 0 || typeof child !== "string") return [child];

      const trimmed = child.replace(/^\s+/, "");
      return trimmed.length > 0 ? [trimmed] : [];
    }
  );

  return (
    <li className="pl-5 text-night-sky-950 dark:text-dawn-pink-100 text-pretty py-1 -indent-5">
      {normalizedChildren}
    </li>
  );
}

export function TooltipPopover({ number, children }: NumberedContentProps) {
  return (
    <Popover.Popover>
      <Popover.PopoverTrigger asChild>
        <button
          type="button"
          className="align-super text-xs font-semibold text-blue-800 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-200 transition-colors"
          aria-label={`Footnote ${String(number)}`}
          aria-describedby={`footnote-${String(number)}`}
        >
          [{number}]
        </button>
      </Popover.PopoverTrigger>
      <Popover.PopoverContent
        className="mx-4 bg-dawn-pink-100 dark:bg-night-sky-950 p-2 rounded-lg shadow-xl z-50 border-night-sky-950 dark:border-dawn-pink-100 border-2"
        sideOffset={5}
      >
        <div className="gap-2 w-fit max-w-60 table">
          <p className="text-sm inline-block">{children}</p>
        </div>
        <Popover.Arrow
          height={10}
          className="dark:fill-dawn-pink-100 fill-night-sky-950"
        />
      </Popover.PopoverContent>
    </Popover.Popover>
  );
}

export function TooltipNote({ number, children }: NumberedContentProps) {
  return (
    <div
      id={`footnote-${String(number)}`}
      className="text-sm text-night-sky-900 dark:text-dawn-pink-200 py-1 flex gap-2"
    >
      <span className="font-semibold text-xs">[{String(number)}]</span>
      <span className="flex-1 text-xs">{children}</span>
    </div>
  );
}

export function TooltipNotes({ children }: FootnotesWrapperProps) {
  return (
    <section aria-label="Footnotes" className="mt-8">
      <hr className="border-night-sky-200 dark:border-dawn-pink-200/40" />
      <div className="pt-4">{children}</div>
    </section>
  );
}

export function Spoiler({ label, children }: { label?: string; children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="my-4">
      <button
        onClick={() => { setIsOpen(!isOpen); }}
        className="cursor-pointer bg-gray-100 dark:bg-gray-800 text-night-sky-900 dark:text-dawn-pink-200 font-semibold px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700  transition-all duration-200 border-night-sky-950 dark:border-dawn-pink-100 border"
      >
        {isOpen ? `Hide ${label || "Spoiler"}` : `Show ${label || "Spoiler"}`}
      </button>
      {isOpen && (
        <div className="mt-2 p-4 bg-gray-100 dark:bg-gray-800 rounded-md border border-night-sky-950 dark:border-dawn-pink-100">
          {children}
        </div>
      )}
    </div>
  );
}

export function MDX({ code }: { code: string }) {
  const Component = useMemo(() => {
    return getMDXComponent(code);
  }, [code]);
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
        li: ListItem,
        ul: List,
        ol: OrderedList,
        blockquote: BlockQuote,
        Image,
        FigureWithCaption,
        NitratePlot,
        LenticularClouds,
        AllLogos,
        WebsiteStackLogos,
        Presentation,
        Publication,
        TooltipPopover,
        TooltipNote,
        TooltipNotes,
        Spoiler,
      }}
    />
  );
}
