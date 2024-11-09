module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  ignorePatterns: ['.eslintrc.js'],
  plugins: ['@typescript-eslint'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  rules: {
    'no-console': ['error', { allow: ['warn', 'error', 'debug'] }],
    '@typescript-eslint/no-unused-vars': 'error',
    'arrow-body-style': 'error',
  },
  parserOptions: {
    sourceType: 'module',
  },
};
