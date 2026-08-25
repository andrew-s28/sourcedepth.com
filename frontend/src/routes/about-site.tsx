import { createFileRoute, ParsedLocation } from "@tanstack/react-router";
import { MDXPost } from "~/components/page";
import { fetchMDXCode, fetchSingleMDXFrontMatter } from "~/utils/mdx-fetcher";
import { seo } from "~/utils/seo";

let prevLoc: ParsedLocation | null = null;

export const Route = createFileRoute("/about-site")({
  loader: async () => {
    return {
      bundle: fetchMDXCode({
        data: { slug: "about-site", directory: "about" },
      }),
      frontmatter: await fetchSingleMDXFrontMatter({
        data: { slug: "about-site", directory: "about" },
      }),
    };
  },
  component: AboutComponent,
  shouldReload(match) {
    try {
      if (match.cause === "enter" || match.cause === "preload") return true;

      const hashOnly =
        prevLoc &&
        prevLoc.pathname === match.location.pathname &&
        prevLoc.searchStr === match.location.searchStr;

      if (hashOnly) return false;

      return true;
    } finally {
      prevLoc = match.location;
    }
  },
  head: () => ({
    meta: [
      ...seo({
        title: "About Site - Andrew Scherer",
        description:
          "Learn more about this site, its history and future, and the technologies used to build it.",
        keywords:
          "Andrew Scherer, about site, personal website, blog, technology, software development, web development",
      }),
    ],
  }),
});

function AboutComponent() {
  const { bundle, frontmatter } = Route.useLoaderData();
  return (
    <>
      <MDXPost bundle={bundle} frontmatter={frontmatter} />
    </>
  );
}
