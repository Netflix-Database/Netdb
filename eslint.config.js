import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import { resolve } from 'node:path';

const compat = new FlatCompat({
  baseDirectory: resolve(),
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        LoginManager: 'writable',
      },
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {},
    },

    extends: compat.extends('eslint:recommended'),

    rules: {
      indent: ['error', 2],
      'linebreak-style': ['error', 'windows'],

      quotes: [
        'error',
        'single',
        {
          allowTemplateLiterals: true,
        },
      ],

      semi: ['error', 'always'],
      'no-unused-vars': ['warn'],

      'no-console': [
        'warn',
        {
          allow: ['warn', 'error'],
        },
      ],

      camelcase: ['warn'],
      'no-var': ['error'],
      'prefer-const': ['warn'],

      'arrow-spacing': [
        'error',
        {
          before: true,
          after: true,
        },
      ],

      'block-spacing': ['error', 'always'],

      'comma-spacing': [
        'error',
        {
          before: false,
          after: true,
        },
      ],

      'key-spacing': [
        'error',
        {
          beforeColon: false,
          afterColon: true,
        },
      ],

      'keyword-spacing': [
        'error',
        {
          before: true,
          after: true,
        },
      ],

      'space-before-blocks': ['error', 'always'],

      'space-before-function-paren': [
        'error',
        {
          anonymous: 'always',
          named: 'never',
          asyncArrow: 'always',
        },
      ],

      'space-in-parens': ['error', 'never'],
      'space-infix-ops': 'error',
      eqeqeq: ['error', 'always'],

      'brace-style': [
        'error',
        '1tbs',
        {
          allowSingleLine: true,
        },
      ],

      'no-multiple-empty-lines': [
        'error',
        {
          max: 2,
          maxEOF: 1,
        },
      ],

      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],

      'max-len': [
        'warn',
        {
          code: 150,
        },
      ],

      'no-await-in-loop': 'warn',
      'prefer-template': 'warn',
      'prefer-arrow-callback': 'warn',
      'no-else-return': 'warn',
      'dot-notation': 'warn',

      'prefer-destructuring': [
        'warn',
        {
          array: false,
          object: true,
        },
      ],
    },
  },
  globalIgnores(['**/node_modules/', '**/dist/', '**/build/', '**/*.min.js']),
]);
