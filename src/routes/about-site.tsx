import { createFileRoute } from "@tanstack/react-router";
import { fetchMDXCode, fetchSingleMDXFrontMatter } from "~/utils/mdx-fetcher";
import { MDXPost } from "~/components/page";

export const Route = createFileRoute("/about-site")({
  loader: async () => {
    return {
      bundle: fetchMDXCode({
        data: { slug: "about-site", directory: "about" },
      }),
      frontmatter: await fetchSingleMDXFrontMatter({
        data: { slug: "about-site", directory: "about" },
      }),
    };
  },
  component: AboutComponent,
});

function AboutComponent() {
  const { bundle, frontmatter } = Route.useLoaderData();
  return (
    <>
      <MDXPost bundle={bundle} frontmatter={frontmatter} />
    </>
  );
}
