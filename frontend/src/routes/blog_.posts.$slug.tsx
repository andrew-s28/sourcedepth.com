import { createFileRoute, ParsedLocation } from "@tanstack/react-router";
import { fetchMDXCode, fetchMDXFrontMatterAndSeries } from "../utils/mdx-fetcher";
import { NotFound } from "~/components/NotFound";
import { MDXPost } from "~/components/page";
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary";
import { seo } from "~/utils/seo";

let prevLoc: ParsedLocation | null = null;

export const Route = createFileRoute("/blog_/posts/$slug")({
  loader: async ({ params: { slug } }) => {
    return {
      bundle: fetchMDXCode({
        data: { slug: slug, directory: "posts" },
      }),
      ...await fetchMDXFrontMatterAndSeries({
        data: { slug: slug, directory: "posts" },
      }),
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
  head: ({ params, loaderData }) => ({
    meta: [
      ...seo({
        title: `${loaderData?.frontmatter.title || ""} - Andrew Scherer`,
        description:
          loaderData?.frontmatter.description ||
          `Explore my blog posts on ${
            loaderData?.frontmatter.tags
              .filter((value, index, self) => self.indexOf(value) === index)
              .join(", ")
              .replace(/, ([^,]*)$/, " and $1") ||
            "technology, science, and software development"
          }.`,
        keywords: `blog, posts, articles, technology, science, software development, ${loaderData?.frontmatter.title || ""}, ${params.slug}`,
      }),
    ],
  }),
});

function PostComponent() {
  const { bundle, frontmatter, series } = Route.useLoaderData();
  return (
    <>
      <MDXPost bundle={bundle} frontmatter={frontmatter} series={series} />
    </>
  );
}
