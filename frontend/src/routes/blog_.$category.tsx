import { createFileRoute } from "@tanstack/react-router";

import { fetchMDX } from "~/utils/mdx-fetcher";
import { NotFound } from "~/components/NotFound";
import { BlogIndex } from "./blog.index";
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary";
import { seo } from "~/utils/seo";
import { capitalizeFirstLetter } from "~/utils/utils";

export const Route = createFileRoute("/blog_/$category")({
  loader: ({ params: { category } }) =>
    fetchMDX({ data: { category: category, directory: "posts" } }),
  errorComponent: DefaultCatchBoundary,
  component: RouteComponent,
  notFoundComponent: () => {
    return <NotFound />;
  },
  head: ({ params }) => ({
    meta: [
      ...seo({
        title: `${capitalizeFirstLetter(params.category)} Blog - Andrew Scherer`,
        description: `Explore my blog posts on ${params.category}.`,
        keywords: `blog, posts, articles, technology, science, software development, ${params.category}`,
      }),
    ],
  }),
});

function RouteComponent() {
  const { frontmatters, categories } = Route.useLoaderData();
  const activeCategory = Route.useParams().category;
  const introDescription = `If you're looking for something else, consider selecting a different category from the options below.`;
  return (
    <BlogIndex
      frontmatters={frontmatters}
      categories={categories}
      activeCategory={activeCategory}
      intro={{
        title: "Blog",
        description: introDescription,
      }}
    />
  );
}
