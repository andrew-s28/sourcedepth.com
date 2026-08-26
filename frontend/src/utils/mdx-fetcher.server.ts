import matter from "gray-matter";
import fs from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

import type { IFrontMatter, IMDX } from "./mdx-fetcher";

import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import rehypePrism from "rehype-prism-plus";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import type { Options } from "@mdx-js/esbuild";

const require = createRequire(import.meta.url);
export const BASE_DIRECTORY = path.join(process.cwd(), "mdx");
export const { bundleMDX } =
  require("mdx-bundler") as typeof import("mdx-bundler");

export const bundler = (file: string, directory: string): Promise<IMDX> => {
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

export async function fetchMDXFrontMatter(directory: string) {
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
        await fs.readFile(path.join(BASE_DIRECTORY, directory, file), "utf8")
      );
      return data as IFrontMatter;
    })
  );
  return frontmatters.sort(orderByDate());
}

export function fetchMDXFrontMatterInSeries(
  directory: string,
  series?: string
) {
  return fetchMDXFrontMatter(directory).then((frontmatters) => {
    return frontmatters
      .filter(
        (frontmatter) =>
          frontmatter.series?.toLowerCase() === series?.toLowerCase()
      )
      .sort(orderByDate());
  });
}

export function getNodeUtils() {
  return {
    fs,
    path,
  };
}
