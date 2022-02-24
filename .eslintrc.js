module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: ['next', 'next/core-web-vitals', 'prettier', 'plugin:prettier/recommended'],
  plugins: ['prettier', 'simple-import-sort'],
  // add your custom rules here
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
}
