import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import importPlugin from "eslint-plugin-import";

export default defineConfig([
  {
    files: ["src/**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      // "sort-imports": [
      //   "error",
      //   {
      //     ignoreCase: true,
      //   },
      // ],
    },
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
    // extends: ["js/recommended", importPlugin.flatConfigs.recommended, importPlugin.flatConfigs.typescript],
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
