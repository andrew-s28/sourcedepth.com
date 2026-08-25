import { IFrontMatter } from "~/utils/mdx-fetcher";
import { Link } from "@tanstack/react-router";
import LongArrow from "./ui/LongArrow";


export default function SeriesNavigationCards({ seriesFrontmatter, currentSlug }: { seriesFrontmatter: IFrontMatter[]; currentSlug: string }) {
  const sortedSeriesFrontmatter = seriesFrontmatter.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  if (sortedSeriesFrontmatter.length <= 1) {
    // only one post in the series, no need to show navigation cards
    return null;
  }
  const currentIndex = sortedSeriesFrontmatter.findIndex((frontmatter) => frontmatter.slug === currentSlug);
  const prevIndex = currentIndex - 1;
  const nextIndex = currentIndex + 1;
  const prevFrontmatter = prevIndex >= 0 ? sortedSeriesFrontmatter[prevIndex] : null;
  const nextFrontmatter = nextIndex < sortedSeriesFrontmatter.length ? sortedSeriesFrontmatter[nextIndex] : null;
  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="flex flex-row">
          <div className="relative max-w-1/3 justify-start">
            {prevFrontmatter ? (
              <Link to="/blog/posts/$slug" params={{ slug: prevFrontmatter.slug }} className="flex flex-col p-2 gap-2 items-center bg-dawn-pink-100 dark:bg-night-sky-950 rounded-lg shadow-md hover:underline transition-all border border-night-sky-950 dark:border-dawn-pink-100">
                <div className="flex flex-row gap-2 w-2/3">
                  <LongArrow orientation="left" width={50} />
                  <div className="mx-auto"> </div>
                  <h3 className="text-lg font-bold">Prev Post</h3>
                </div>
                <h4 className="text-md font-bold">{prevFrontmatter.title}</h4>
              </Link>
            ) : null}
          </div>

          <div className="mx-auto"> </div>

          <div className="relative max-w-1/3 justify-end">
            {nextFrontmatter ? (
              <Link to="/blog/posts/$slug" params={{ slug: nextFrontmatter.slug }} className="flex flex-col p-2 gap-2 items-center bg-dawn-pink-100 dark:bg-night-sky-950 rounded-lg shadow-md hover:underline transition-all border border-night-sky-950 dark:border-dawn-pink-100">
                <div className="flex flex-row gap-2 w-2/3">
                  <h3 className="text-lg font-bold">Next Post</h3>
                  <div className="mx-auto"> </div>
                  <LongArrow orientation="right" width={50} />
                </div>
                <h4 className="text-md font-bold">{nextFrontmatter.title}</h4>
              </Link>
            ) : null}
          </div>
      </div>
    </div>
  )
}
