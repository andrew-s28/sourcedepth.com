import { createFileRoute, Link } from "@tanstack/react-router";
import { fetchMDX } from "../utils/mdx-fetcher";
import { NotFound } from "~/components/NotFound";
import { IFrontMatter } from "~/utils/mdx-fetcher";
import { Content, Description, Intro, Wrapper } from "~/components/page";
import { Route as BlogCategoryRoute } from "./blog_.$category";
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary";
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
      intro={{
        title: "Blog",
        description: introDescription,
      }}
    />
  );
}

export function BlogIndex({
  frontmatters,
  categories,
  intro,
  activeCategory,
}: {
  frontmatters: IFrontMatter[];
  intro: { title: string; description: string };
  categories: string[];
  activeCategory?: string;
}) {
  return (
    <Wrapper>
      <Intro intro={intro}>
        {categories.map((category) =>
          activeCategory === category ? (
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
              to={BlogCategoryRoute.to}
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
              to="/blog/posts/$slug"
              index={i}
            />
          );
        })}
      </Content>
    </Wrapper>
  );
}
