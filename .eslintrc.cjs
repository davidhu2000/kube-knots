module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:tailwindcss/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "tailwindcss", "react"],
  root: true,
  ignorePatterns: ["src-tauri/target", "dist", "*.js"],
  rules: {
    "@typescript-eslint/consistent-type-imports": "error",
  },
};
