import { createFileRoute } from "@tanstack/react-router";
import {
  ProjectsIndex,
  projectCategories,
  projectFrontmatters,
} from "~/routes/projects.index";
import { NotFound } from "~/components/NotFound";
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary";

export const Route = createFileRoute("/projects_/$category")({
  errorComponent: DefaultCatchBoundary,
  component: RouteComponent,
  notFoundComponent: () => {
    return <NotFound />;
  },
});

function RouteComponent() {
  const activeCategory = Route.useParams().category;
  const frontmatters = projectFrontmatters.filter((f) =>
    f.tags.includes(activeCategory)
  );
  const introDescription =
    "My projects span my research, software, and data interests, as well as some just-for-fun tools that I've built.";
  return (
    <ProjectsIndex
      frontmatters={frontmatters}
      categories={projectCategories}
      activeCategory={activeCategory}
      intro={{
        title: "Projects",
        description: introDescription,
      }}
    />
  );
}
