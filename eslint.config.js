import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

export default defineConfig([
  { files: ["src/**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  {
    files: ["src/**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      "no-unused-vars": "off",  // Results in annoying errors with typing functions
    }
  },
  { settings: { react: { version: "detect" } } },
  tseslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  pluginReact.configs.flat.recommended,
  {
    files: ["src/**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    rules: {
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
    },
  },
  globalIgnores([
    ".output/",
    ".vinxi/",
    "node_modules/",
    "public/",
    "eslint.config.js",
  ]),
]);
