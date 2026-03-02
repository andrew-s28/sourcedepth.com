import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from 'nitro/vite'
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
    nitro(),
    viteReact({ include: /\.(mdx|js|jsx|ts|tsx)$/ }),
  ],
});
