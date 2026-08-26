import { notFound } from "@tanstack/react-router";
import { createMiddleware, createServerFn } from "@tanstack/react-start";
import matter from "gray-matter";
import { existsSync } from "node:fs";
import { z } from "zod";

export interface IFrontMatter {
  title: string;
  slug: string;
  date: string;
  description: string;
  tags: string[];
  series?: string;
}

export interface IMDX {
  code: string;
  frontmatter: IFrontMatter;
}

export interface AwaitIMDX {
  bundle: Promise<IMDX>;
  frontmatter: IFrontMatter;
}

const mdxPostInputSchema = z.object({
  directory: z.string().min(1),
  slug: z.string().min(1),
});

const mdxFrontMatterInputSchema = z.object({
  directory: z.string().min(1),
  category: z.string().min(1).optional(),
});

const lowercaseSingleMdxMiddleware = createMiddleware({
  type: "function",
}).validator((data: { directory: string; slug: string }) => {
  const parsed = mdxPostInputSchema.parse(data);
  return {
    directory: parsed.directory.toLowerCase(),
    slug: parsed.slug.toLowerCase(),
  };
});

const lowercaseMultipleMdxMiddleware = createMiddleware({
  type: "function",
}).validator((data: { directory: string; category?: string }) => {
  const parsed = mdxFrontMatterInputSchema.parse(data);
  return {
    directory: parsed.directory.toLowerCase(),
    category: parsed.category?.toLowerCase(),
  };
});

const ensureImports = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const module = await import("./mdx-fetcher.server"); // make sure imports are loaded before proceeding
    return next({
      context: {
        module,
      },
    });
  }
);

const ensureMdxFileExistsMiddleware = createMiddleware({ type: "function" })
  .validator(mdxPostInputSchema)
  .server(async ({ next, data }) => {
    const { getNodeUtils, BASE_DIRECTORY } =
      await import("./mdx-fetcher.server");
    const { path } = getNodeUtils();
    const mdxPath = path.join(
      BASE_DIRECTORY,
      data.directory,
      data.slug + ".mdx"
    );
    if (!existsSync(mdxPath)) {
      throw notFound();
    }
    return next();
  });

export const fetchSingleMDXFrontMatter = createServerFn({ method: "GET" })
  .middleware([
    ensureImports,
    lowercaseSingleMdxMiddleware,
    ensureMdxFileExistsMiddleware,
  ])
  .handler(async ({ data, context }) => {
    const { getNodeUtils, BASE_DIRECTORY } = context.module;
    const { fs, path } = getNodeUtils();
    const file = await fs.readFile(
      path.join(BASE_DIRECTORY, data.directory, data.slug + ".mdx"),
      "utf8"
    );
    const { data: frontmatter } = matter(file);
    return frontmatter as IFrontMatter;
  });

function getCategories(frontmatters: IFrontMatter[]) {
  return Array.from(
    new Set(
      frontmatters
        .map((frontmatter) => {
          return frontmatter.tags.map((tag) => tag.toLowerCase());
        })
        .flat()
        .sort()
    )
  );
}

export const fetchMDXFrontMatterAndSeries = createServerFn({ method: "GET" })
  .middleware([
    ensureImports,
    lowercaseSingleMdxMiddleware,
    ensureMdxFileExistsMiddleware,
  ])
  .handler(async ({ data, context }) => {
    const { getNodeUtils, BASE_DIRECTORY, fetchMDXFrontMatterInSeries } =
      context.module;
    const { fs, path } = getNodeUtils();
    const file = await fs.readFile(
      path.join(BASE_DIRECTORY, data.directory, data.slug + ".mdx"),
      "utf8"
    );
    const { data: frontmatter } = matter(file) as unknown as {
      data: IFrontMatter;
    };
    if (frontmatter.series) {
      const seriesFrontmatters = await fetchMDXFrontMatterInSeries(
        data.directory,
        frontmatter.series
      );
      return {
        frontmatter,
        series: seriesFrontmatters,
      };
    }
    return {
      frontmatter,
      series: undefined,
    };
  });

export const fetchMDXCode = createServerFn({ method: "GET" })
  .middleware([
    ensureImports,
    lowercaseSingleMdxMiddleware,
    ensureMdxFileExistsMiddleware,
  ])
  .handler(async ({ data, context }) => {
    const { bundler } = context.module;
    try {
      // post names must be the same as the slug!
      const bundle = await bundler(data.slug + ".mdx", data.directory);
      return bundle;
    } catch (err) {
      console.log(err);
      throw notFound();
    }
  });

export const fetchMDX = createServerFn({ method: "GET" })
  .middleware([ensureImports, lowercaseMultipleMdxMiddleware])
  .handler(async ({ data, context }) => {
    const { fetchMDXFrontMatter } = context.module;
    try {
      let frontmatters = await fetchMDXFrontMatter(data.directory);
      const categories = getCategories(frontmatters);
      frontmatters = frontmatters.filter((post) =>
        data.category ? post.tags.includes(data.category) : true
      );
      if (frontmatters.length === 0) {
        throw notFound();
      }
      return {
        frontmatters: frontmatters,
        categories: categories,
      };
    } catch (err) {
      console.log(err);
      throw notFound();
    }
  });
