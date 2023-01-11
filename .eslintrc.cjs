module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:tailwindcss/recommended",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "tailwindcss"],
  root: true,
  ignorePatterns: ["src-tauri/target", "dist", "*.js"],
  rules: {
    "@typescript-eslint/consistent-type-imports": "error",
  },
};
