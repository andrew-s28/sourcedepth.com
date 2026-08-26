import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";

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
      "@typescript-eslint/only-throw-error": [
        "error",
        {
          allow: [
            {
              "from": "package",
              "package": "@tanstack/router-core",
              "name": "Redirect"
            },
            {
              "from": "package",
              "package": "@tanstack/router-core",
              "name": "NotFoundError"
            }
          ]
        }
      ]
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
  {
    files: ["src/**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: { js },
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
