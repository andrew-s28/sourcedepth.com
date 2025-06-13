import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { fetchMDX, IFrontMatter } from "../utils/mdx-fetcher";
import { NotFound } from "~/components/NotFound";
import { Content, Description, Intro, Wrapper } from "~/components/page";
import { Route as ProjectSlugRoute } from "./projects_.posts.$slug";
import { Route as ProjectCategoryRoute } from "./projects_.$category";
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary";

export const Route = createFileRoute("/projects/")({
  loader: () => fetchMDX({ data: { directory: "projects" } }),
  errorComponent: DefaultCatchBoundary,
  component: RouteComponent,
  notFoundComponent: () => {
    return <NotFound />;
  },
});

function RouteComponent() {
  const { frontmatters, categories } = Route.useLoaderData();
  const introDescription =
    "My projects span my research, software, and data interests, as well as some just-for-fun tools that I've built.";
  return (
    <ProjectsIndex
      frontmatters={frontmatters}
      categories={categories}
      intro={{
        title: "Projects",
        description: introDescription,
      }}
    />
  );
}

export function ProjectsIndex({
  frontmatters,
  intro,
  categories,
  activeCategory,
}: {
  frontmatters: IFrontMatter[];
  intro: { title: string; description: string };
  categories: string[];
  activeCategory?: string;
}) {
  console.log(categories);
  return (
    <Wrapper>
      <Intro intro={intro}>
        {categories.map((category) =>
          activeCategory == category ? (
            <Link
              key={category}
              to={Route.to}
              params={{ category: category.toLowerCase() }}
              className={
                activeCategory == category
                  ? "px-3 py-1 capitalize bg-night-sky-600 text-dawn-pink-100 rounded-full text-sm font-medium hover:bg-night-sky-700 transition"
                  : "px-3 py-1 capitalize bg-night-sky-800 text-dawn-pink-100 rounded-full text-sm font-medium hover:bg-night-sky-700 transition"
              }
              viewTransition
            >
              {category}
            </Link>
          ) : (
            <Link
              key={category}
              to={ProjectCategoryRoute.to}
              params={{ category: category.toLowerCase() }}
              className={
                activeCategory == category
                  ? "px-3 py-1 capitalize bg-night-sky-600 text-dawn-pink-100 rounded-full text-sm font-medium hover:bg-night-sky-700 transition"
                  : "px-3 py-1 capitalize bg-night-sky-800 text-dawn-pink-100 rounded-full text-sm font-medium hover:bg-night-sky-700 transition"
              }
              viewTransition
            >
              {category}
            </Link>
          )
        )}
      </Intro>
      <Content>
        {frontmatters.map((frontmatter, i) => {
          return (
            <Description
              frontmatter={frontmatter}
              key={frontmatter.slug}
              to={ProjectSlugRoute.to}
              index={i}
            />
          );
        })}
      </Content>
    </Wrapper>
  );
}
