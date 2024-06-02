module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['react', '@typescript-eslint', 'react-hooks', 'prettier', 'import'],
  rules: {
    // 禁止允许空函数 https://eslint.org/docs/latest/rules/no-empty-function
    'no-empty-function': 'off',
    // 禁止未使用变量 https://eslint.org/docs/latest/rules/no-unused-vars
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/ban-ts-comment': 'warn',
    // 缩进必须为 2 个空格 https://eslint.org/docs/latest/rules/indent#rule-details
    indent: ['error', 2],
    // 禁止所有 tab https://eslint.org/docs/latest/rules/no-tabs#rule-details
    'no-tabs': 'error',
    // 使用单引号 https://eslint.org/docs/latest/rules/quotes#version
    quotes: ['error', 'single'],
    // 禁止使用 var https://eslint.org/docs/latest/rules/no-var#rule-details
    'no-var': 'error',
    // 不允许后面的逗号在对象和数组文本 https://eslint.org/docs/latest/rules/no-comma-dangle#rule-details
    'no-comma-dangle': 'off',
    // 禁止多个空行 https://eslint.org/docs/latest/rules/no-multiple-empty-lines#rule-details
    'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
    // 在文件末尾要求或禁止换行 https://eslint.org/docs/latest/rules/eol-last#rule-details
    'eol-last': 'error',
    // 强制默认参数为最后一个 https://eslint.org/docs/latest/rules/default-param-last#rule-details
    'default-param-last': 'off',
    // 不允许不必要的分号 https://eslint.org/docs/latest/rules/no-extra-semi#rule-details
    'no-extra-semi': 'off',
    // 不允许分号
    semi: [2, 'never'],
    // 不允许使用any类型 https://typescript-eslint.io/rules/no-explicit-any/
    '@typescript-eslint/no-explicit-any': 'off',
    //不允许使用未声明的变量 https://eslint.org/docs/latest/rules/no-undef
    'no-undef': 'off',
    'no-async-promise-executor': 'error',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    //Prettier
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto'
      }
    ],
    //配置import模块进行分组
    'import/no-unresolved': [2, { commonjs: true, amd: true }],
    'import/no-named-as-default-member': 0,
    'import/order': [
      'error',
      {
        groups: [['builtin', 'external'], 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        },
        pathGroups: [
          {
            pattern: '{react,react-dom/**,react-router-dom}',
            group: 'builtin',
            position: 'before'
          },
          {
            pattern: '@/**',
            group: 'internal',
            position: 'before'
          }
        ],
        pathGroupsExcludedImportTypes: ['builtin']
      }
    ]
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: 'tsconfig.json'
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        paths: ['src']
      }
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    react: {
      version: 'detect'
    }
  }
}
