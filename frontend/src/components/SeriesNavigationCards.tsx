import { Link } from "@tanstack/react-router";
import { IFrontMatter } from "~/utils/mdx-fetcher";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export default function SeriesNavigationCards({
  seriesFrontmatter,
  currentSlug,
}: {
  seriesFrontmatter: IFrontMatter[];
  currentSlug: string;
}) {
  const sortedSeriesFrontmatter = seriesFrontmatter.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  if (sortedSeriesFrontmatter.length <= 1) {
    // only one post in the series, no need to show navigation cards
    return null;
  }
  const currentIndex = sortedSeriesFrontmatter.findIndex(
    (frontmatter) => frontmatter.slug === currentSlug
  );
  const prevIndex = currentIndex - 1;
  const nextIndex = currentIndex + 1;
  const prevFrontmatter =
    prevIndex >= 0 ? sortedSeriesFrontmatter[prevIndex] : null;
  const nextFrontmatter =
    nextIndex < sortedSeriesFrontmatter.length
      ? sortedSeriesFrontmatter[nextIndex]
      : null;
  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="flex sm:flex-row flex-col px-10">
        <div className="relative group sm:max-w-2/5 w-full justify-start">
          {prevFrontmatter ? (
            <Link
              to="/blog/posts/$slug"
              params={{ slug: prevFrontmatter.slug }}
              className="flex flex-row items-center justify-start text-left"
            >
            <div className="relative me-2 -translate-x-5">
            <ChevronLeft
              className="absolute opacity-0 group-hover:opacity-100 my-auto top-1/2 transform -translate-y-1/2 group-hover:-translate-x-5 transition-all duration-1000 ease-in-out animate-out"
              size={20}
              aria-hidden="true"
            />
            <ChevronLeft
              className="absolute opacity-0 group-hover:opacity-100 my-auto top-1/2 transform -translate-y-1/2 group-hover:-translate-x-3 transition-all duration-1000 ease-in-out"
              size={20}
              aria-hidden="true"
            />
            <ArrowLeft
              className="absolute my-auto top-1/2 transform -translate-y-1/2 transition-transform duration-1000 ease-in-out"
              size={20}
              aria-hidden="true"
            />
          </div>
              <div className="flex flex-col w-2/3">
                                <h3 className="text-md italic">Last Post</h3>
                <h4 className="text-md font-bold">{prevFrontmatter.title}</h4>
              </div>
            </Link>
          ) : null}
        </div>

        <div className="mx-auto"> </div>

        <div className="relative group sm:max-w-2/5 w-full justify-end">
          {nextFrontmatter ? (
            <Link
              to="/blog/posts/$slug"
              params={{ slug: nextFrontmatter.slug }}
              className="flex flex-row items-center justify-end text-right"
            >
              <div className="flex flex-col w-2/3">
                <h3 className="text-md italic">Next Post</h3>
                <h4 className="text-md font-bold">{nextFrontmatter.title}</h4>
              </div>
              <div className="relative ms-2">
            <ArrowRight
              className="absolute my-auto top-1/2 transform -translate-y-1/2 transition-transform duration-1000 ease-in-out"
              size={20}
              aria-hidden="true"
            />
            <ChevronRight
              className="absolute opacity-0 group-hover:opacity-100 my-auto top-1/2 transform -translate-y-1/2 group-hover:translate-x-3 transition-all duration-1000 ease-in-out"
              size={20}
              aria-hidden="true"
            />
            <ChevronRight
              className="absolute opacity-0 group-hover:opacity-100 my-auto top-1/2 transform -translate-y-1/2 group-hover:translate-x-5 transition-all duration-1000 ease-in-out animate-out"
              size={20}
              aria-hidden="true"
            />
          </div>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
