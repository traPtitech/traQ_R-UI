const { resolve } = require('path')

module.exports = {
  root: true,

  env: {
    node: true
  },

  plugins: ['@typescript-eslint'],

  extends: ['plugin:vue/essential', '@vue/prettier'],

  rules: {
    'no-undef': 'off',
    'no-unused-vars': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'prettier/prettier': [
      2,
      {
        printWidth: 80,
        singleQuote: true,
        semi: false
      }
    ]
  },

  parserOptions: {
    parser: '@typescript-eslint/parser'
  }
}
