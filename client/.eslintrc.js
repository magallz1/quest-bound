module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  ignorePatterns: ['.eslintrc.js'],
  plugins: ["@typescript-eslint"],
  extends: [
      "plugin:@typescript-eslint/recommended",
      "plugin:prettier/recommended",
      "plugin:react/recommended"
  ],
  rules: {
      "no-console": ["error", { "allow": ["warn", "error", "debug"] }],
      "@typescript-eslint/no-unused-vars": "error",
      "arrow-body-style": "error",
      '@typescript-eslint/no-var-requires': 'warn',
      "react/no-unknown-property": [0],
      "react/prop-types": ["off"]
  },
  parserOptions: {
      sourceType: "module"
  }
}