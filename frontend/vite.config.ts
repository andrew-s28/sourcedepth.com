import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import mdx from "@mdx-js/rollup";
import rehypePrettyCode from "rehype-pretty-code";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    { enforce: "pre", ...mdx({ rehypePlugins: [rehypePrettyCode] }) },
    tsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    tanstackStart({
      prerender: {
        crawlLinks: true,
        failOnError: true,
      },
    }),
    react({ include: /\.(mdx|js|jsx|ts|tsx)$/ }),
  ],
});
