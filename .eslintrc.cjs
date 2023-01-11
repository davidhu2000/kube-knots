module.exports = {
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  root: true,
  ignorePatterns: ["src-tauri/target", "dist"],
  rules: {
    "@typescript-eslint/consistent-type-imports": "error",
  },
};
