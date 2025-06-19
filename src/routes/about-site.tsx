import { createFileRoute, ParsedLocation } from "@tanstack/react-router";
import { fetchMDXCode, fetchSingleMDXFrontMatter } from "~/utils/mdx-fetcher";
import { MDXPost } from "~/components/page";

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
});

function AboutComponent() {
  const { bundle, frontmatter } = Route.useLoaderData();
  return (
    <>
      <MDXPost bundle={bundle} frontmatter={frontmatter} />
    </>
  );
}
