import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import fs from "node:fs/promises";
import matter from "gray-matter";
import path from "node:path";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import rehypePrism from 'rehype-prism-plus'
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

import type { Options } from "@mdx-js/esbuild";

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

const BASE_DIRECTORY = path.join(process.cwd(), "mdx");

// mdx-bundler deps aren't playing nice with ESM, so we have to use createRequire to import it
const require = createRequire(import.meta.url);
const { bundleMDX } = require("mdx-bundler") as typeof import("mdx-bundler");

const bundler = (file: string, directory: string): Promise<IMDX> => {
  return bundleMDX({
    file: path.join(BASE_DIRECTORY, directory, file),
    cwd: process.cwd(),
    bundleDirectory: path.join(BASE_DIRECTORY, directory),
    bundlePath: directory,
    mdxOptions(options: Options) {
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        [
          rehypePrettyCode,
          { theme: { dark: "github-dark-dimmed", light: "github-light" } },
        ],
        [rehypePrism],
        [rehypeKatex],
      ];
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        [remarkGfm],
        [remarkMath],
      ];
      return options;
    },
    esbuildOptions(options) {
      options.alias = {
        "~": path.resolve(process.cwd(), "src"),
      };
      options.loader = {
        ...options.loader,
        ".png": "file",
      };
      return options;
    },
  });
};

function orderByDate() {
  return (a: IFrontMatter, b: IFrontMatter) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  };
}

async function fetchMDXFrontMatter(directory: string) {
  const allFiles = await fs.readdir(path.join(BASE_DIRECTORY, directory), {
    withFileTypes: true,
  });
  const files = allFiles
    .filter((file) => file.isFile())
    .map((file) => file.name)
    .filter((file) => file.endsWith(".mdx"));
  const frontmatters = await Promise.all(
    files.map(async (file) => {
      const { data } = matter(
        await fs.readFile(path.join(BASE_DIRECTORY, directory, file), "utf8"),
      );
      return data as IFrontMatter;
    }),
  );
  return frontmatters.sort(orderByDate());
}

export const fetchSingleMDXFrontMatter = createServerFn({ method: "GET" })
  .inputValidator((data: { directory: string; slug: string }) => {
    if (!data.directory || !data.slug) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw notFound();
    }
    const mdxPath = path.join(
      BASE_DIRECTORY,
      data.directory,
      data.slug + ".mdx",
    );
    if (!existsSync(mdxPath)) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw notFound();
    }
    return {
      directory: data.directory.toLowerCase(),
      slug: data.slug.toLowerCase(),
    };
  })
  .handler(async ({ data }) => {
    const file = await fs.readFile(
      path.join(BASE_DIRECTORY, data.directory, data.slug + ".mdx"),
      "utf8",
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
        .sort(),
    ),
  );
}

function fetchMDXFrontMatterInSeries(directory: string, series?: string) {
  return fetchMDXFrontMatter(directory).then((frontmatters) => {
    return (
      frontmatters
        .filter(
          (frontmatter) => frontmatter.series?.toLowerCase() === series?.toLowerCase(),
        )
        .sort(orderByDate())
    );
  });
}

export const fetchMDXFrontMatterAndSeries = createServerFn({ method: "GET" })
  .inputValidator((data: { directory: string; slug: string }) => {
    if (!data.directory || !data.slug) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw notFound();
    }
    const mdxPath = path.join(
      BASE_DIRECTORY,
      data.directory,
      data.slug + ".mdx",
    );
    if (!existsSync(mdxPath)) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw notFound();
    }
    return {
      directory: data.directory.toLowerCase(),
      slug: data.slug.toLowerCase(),
    };
  })
  .handler(async ({ data }) => {
    const file = await fs.readFile(
      path.join(BASE_DIRECTORY, data.directory, data.slug + ".mdx"),
      "utf8",
    );
    const { data: frontmatter } = matter(file) as unknown as { data: IFrontMatter };
    if (frontmatter.series) {
      const seriesFrontmatters = await fetchMDXFrontMatterInSeries(
        data.directory,
        frontmatter.series,
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
  .inputValidator((data: { directory: string; slug: string }) => {
    return {
      directory: data.directory.toLowerCase(),
      slug: data.slug.toLowerCase(),
    };
  })
  .handler(async ({ data }) => {
    try {
      // post names must be the same as the slug!
      const bundle = await bundler(data.slug + ".mdx", data.directory);
      return bundle;
    } catch (err) {
      console.log(err);
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw notFound();
    }
  });

export const fetchMDX = createServerFn({ method: "GET" })
  .inputValidator((data: { directory: string; category?: string }) => {
    if (data.category) {
      data.category = data.category.toLowerCase();
    }
    return {
      directory: data.directory.toLowerCase(),
      category: data.category,
    };
  })
  .handler(async ({ data }) => {
    try {
      let frontmatters = await fetchMDXFrontMatter(data.directory);
      const categories = getCategories(frontmatters);
      frontmatters = frontmatters.filter((post) =>
        data.category ? post.tags.includes(data.category) : true,
      );
      if (frontmatters.length === 0) {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw notFound();
      }
      return {
        frontmatters: frontmatters,
        categories: categories,
      };
    } catch (err) {
      console.log(err);
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw notFound();
    }
  });
