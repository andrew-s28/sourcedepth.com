import { createFileRoute } from "@tanstack/react-router";
import { BlogIndex } from "~/components/BlogIndex";
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary";
import { NotFound } from "~/components/NotFound";
import { fetchMDX } from "~/utils/mdx-fetcher";
import { seo } from "~/utils/seo";

export const Route = createFileRoute("/blog/")({
  loader: () => fetchMDX({ data: { directory: "posts" } }),
  errorComponent: DefaultCatchBoundary,
  component: RouteComponent,
  notFoundComponent: () => {
    return <NotFound />;
  },
  head: ({ loaderData }) => ({
    meta: [
      ...seo({
        title: `Blog - Andrew Scherer`,
        description: `Explore my blog posts on ${
          loaderData?.frontmatters
            .map((fm) => fm.tags)
            .flat()
            .filter((value, index, self) => self.indexOf(value) === index)
            .join(", ") || "technology,"
        }, science, software development, and more.`,
        keywords: `blog, posts, articles, technology, science, software development`,
      }),
    ],
  }),
});

function RouteComponent() {
  const { frontmatters, categories } = Route.useLoaderData();
  const introDescription =
    "If you're looking for something specific, consider selecting a category from the options below.";
  return (
    <BlogIndex
      frontmatters={frontmatters}
      categories={categories}
      clearCategoryTo="/blog"
      categoryTo="/blog/$category"
      intro={{
        title: "Blog",
        description: introDescription,
      }}
    />
  );
}
