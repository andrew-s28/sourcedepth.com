import { createFileRoute } from "@tanstack/react-router";

import { fetchMDX } from "~/utils/mdx-fetcher";
import { NotFound } from "~/components/NotFound";
import { PostErrorCompoent } from "~/components/PostError";
import { BlogIndex } from "./blog.index";
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary";

export const Route = createFileRoute("/blog_/$category")({
  loader: ({ params: { category } }) =>
    fetchMDX({ data: { category: category, directory: "posts" } }),
  errorComponent: DefaultCatchBoundary,
  component: RouteComponent,
  notFoundComponent: () => {
    return <NotFound />;
  },
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
