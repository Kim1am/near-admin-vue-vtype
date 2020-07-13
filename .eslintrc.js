module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', 'eslint:recommended'],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-unused-vars': 2,
    indent: ['error', 2],
    'no-multiple-empty-lines': [
      1,
      {
        max: 1, // 文件内最多连续 3 个
        maxEOF: 1, // 文件末尾最多连续 1 个
        maxBOF: 1, // 文件头最多连续 1 个
      },
    ],
    'no-multi-spaces': 2,
    'no-mixed-spaces-and-tabs': 2,
    quotes: [
      2,
      'single',
      {
        avoidEscape: true, // 允许包含单引号的字符串使用双引号
        allowTemplateLiterals: true, // 允许使用模板字符串
      },
    ],
    semi: ['error', 'never'],
    'no-console': 1,
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'always',
        asyncArrow: 'always',
      },
    ],
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        mocha: true,
      },
    },
  ],
}
