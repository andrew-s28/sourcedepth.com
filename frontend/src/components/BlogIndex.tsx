import { Link } from "@tanstack/react-router";
import { Content, Description, Intro, Wrapper } from "~/components/page";
import type { IFrontMatter } from "~/utils/mdx-fetcher";

interface BlogIndexProps {
  frontmatters: IFrontMatter[];
  intro: { title: string; description: string };
  categories: string[];
  activeCategory?: string;
  clearCategoryTo: "/blog";
  categoryTo: "/blog/$category";
}

export function BlogIndex({
  frontmatters,
  categories,
  intro,
  activeCategory,
  clearCategoryTo,
  categoryTo,
}: BlogIndexProps) {
  return (
    <Wrapper>
      <Intro intro={intro}>
        {categories.map((category) =>
          activeCategory === category ? (
            <Link
              key={category}
              to={clearCategoryTo}
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
              to={categoryTo}
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
