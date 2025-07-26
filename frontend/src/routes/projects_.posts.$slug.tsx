import {
  createFileRoute,
  notFound,
  ParsedLocation,
} from "@tanstack/react-router";
import { NotFound } from "~/components/NotFound";
import { MDXPost } from "~/components/page";
import {
  fetchMDXCode,
  fetchSingleMDXFrontMatter,
  IFrontMatter,
} from "~/utils/mdx-fetcher";
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary";

let prevLoc: ParsedLocation | null = null;

export const Route = createFileRoute("/projects_/posts/$slug")({
  loader: async ({ params: { slug } }) => {
    let frontmatter: IFrontMatter;
    try {
      frontmatter = await fetchSingleMDXFrontMatter({
        data: { slug: slug, directory: "projects" },
      });
    } catch (error) {
      console.error("Error fetching frontmatter:", error);
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw notFound();
    }
    const bundle = fetchMDXCode({
      data: { slug: slug, directory: "projects" },
    });
    return {
      bundle: bundle,
      frontmatter: frontmatter,
    };
  },
  errorComponent: DefaultCatchBoundary,
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
