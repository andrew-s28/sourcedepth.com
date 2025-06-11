import { createFileRoute } from "@tanstack/react-router";
import { ProjectsIndex } from "./projects.index";
import { fetchMDX } from "~/utils/mdx-fetcher";
import { PostErrorComponent } from "~/components/PostError";
import { NotFound } from "~/components/NotFound";

export const Route = createFileRoute("/projects_/$category")({
  loader: ({ params: { category } }) =>
    fetchMDX({ data: { category: category, directory: "projects" } }),
  errorComponent: PostErrorComponent,
  component: RouteComponent,
  notFoundComponent: () => {
    return <NotFound />;
  },
});

function RouteComponent() {
  const { frontmatters, categories } = Route.useLoaderData();
  const activeCategory = Route.useParams().category;
  console.log(categories);
  const introDescription =
    "Software, data, and just-for-fun tools that I've built.";
  return (
    <ProjectsIndex
      frontmatters={frontmatters}
      categories={categories}
      activeCategory={activeCategory}
      intro={{
        title: "Projects",
        description: introDescription,
      }}
    />
  );
}
