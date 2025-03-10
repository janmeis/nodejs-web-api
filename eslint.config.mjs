// https://youtu.be/413C1PlYIko?si=Nxf6Endy1NK5XMUd

import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ['dist/'],
  },
  { files: ['src/**/*.{js,ts,jsx,tsx}'] },
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/semi': ['warn', 'always'],
      'prettier/prettier': [
        'warn',
        { singleQuote: true },
        { SemicolonPreference: 'always' },
      ],
    },
  },
  eslintPluginPrettierRecommended,
];
