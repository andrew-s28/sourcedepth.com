import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import mdx from "@mdx-js/rollup";
import rehypePrettyCode from "rehype-pretty-code";

export default defineConfig({
    plugins: [
      { enforce: "pre", ...mdx({ rehypePlugins: [rehypePrettyCode] }) },
      tsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
      tanstackStart({
        prerender: {
          crawlLinks: true,
          failOnError: true,
        },
      })
    ],
  // },
});
