module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module"
  },
  env: {
    node: true
  },
  plugins: ["@typescript-eslint/eslint-plugin", "eslint-plugin-prettier"],
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  ignorePatterns: ["node_modules", "dist"]
};
