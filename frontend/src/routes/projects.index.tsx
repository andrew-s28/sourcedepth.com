import { createFileRoute, Link } from "@tanstack/react-router";
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary";
import { NotFound } from "~/components/NotFound";
import { Content, Description, Intro, Wrapper } from "~/components/page";
import { IFrontMatter } from "../utils/mdx-fetcher";
import { Route as ProjectCategoryRoute } from "./projects_.$category";

export const Route = createFileRoute("/projects/")({
  errorComponent: DefaultCatchBoundary,
  component: RouteComponent,
  notFoundComponent: () => {
    return <NotFound />;
  },
});

interface IProjectFrontmatter extends IFrontMatter {
  to: string;
}

export const projectFrontmatters: IProjectFrontmatter[] = [
  {
    title: "Shelf Nitrate Response to Upwelling",
    slug: "shelf-nitrate-response-to-upwelling",
    date: "",
    description:
      "Nitrate is an essential nutrient for phytoplankton growth, which forms the base of the marine food web. This project explores the response of Oregon shelf nitrate concentrations to upwelling events using newly available observational data from the Ocean Observatories Initiative.",
    tags: ["research", "oceanography", "nitrate", "upwelling"],
    to: "/projects/shelf-nitrate-response-to-upwelling",
  },
  {
    title: "GitHub Actions Dashboard",
    slug: "github-actions-dashboard",
    date: "",
    description:
      "A dashboard to visualize my GitHub Actions workflows and their performance. This project provides a high-level overview of all my repositories with actions running.",
    tags: ["tools", "software", "github", "dashboard"],
    to: "/projects/actions-dashboard",
  },
];

export const projectCategories = ["research", "tools"];

function RouteComponent() {
  const introDescription =
    "My projects span my research, software, and data interests, as well as some just-for-fun tools that I've built.";
  const frontmatters = projectFrontmatters;
  return (
    <ProjectsIndex
      frontmatters={frontmatters}
      categories={projectCategories}
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
  frontmatters: IProjectFrontmatter[];
  intro: { title: string; description: string };
  categories: string[];
  activeCategory?: string;
}) {
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
              to={frontmatter.to}
              index={i}
            />
          );
        })}
      </Content>
    </Wrapper>
  );
}
