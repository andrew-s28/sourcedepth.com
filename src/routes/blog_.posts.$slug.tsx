import { createFileRoute, ParsedLocation } from "@tanstack/react-router";
import { fetchMDXCode, fetchSingleMDXFrontMatter } from "../utils/mdx-fetcher";
import { NotFound } from "~/components/NotFound";
import { PostErrorComponent } from "~/components/PostError";
import { MDXPost } from "~/components/page";

let prevLoc: ParsedLocation | null = null;

export const Route = createFileRoute("/blog_/posts/$slug")({
  loader: async ({ params: { slug } }) => {
    return {
      bundle: fetchMDXCode({
        data: { slug: slug, directory: "posts" },
      }),
      frontmatter: await fetchSingleMDXFrontMatter({
        data: { slug: slug, directory: "posts" },
      }),
    };
  },
  errorComponent: PostErrorComponent,
  component: PostComponent,
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
  notFoundComponent: () => {
    return <NotFound />;
  },
});

function PostComponent() {
  const { bundle, frontmatter } = Route.useLoaderData();
  return (
    <>
      <MDXPost bundle={bundle} frontmatter={frontmatter} />
    </>
  );
}
