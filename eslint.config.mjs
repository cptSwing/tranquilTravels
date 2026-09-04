import jsEslint from '@eslint/js';
import globals from 'globals';
import reactEslint from 'eslint-plugin-react';
import reactHooksEslint from 'eslint-plugin-react-hooks';
import reactRefreshEslint from 'eslint-plugin-react-refresh';
import tsEslint from 'typescript-eslint';
import prettierEslintRecommended from 'eslint-plugin-prettier/recommended';
import jsxA11yEslint from 'eslint-plugin-jsx-a11y';
import pluginQueryEslint from '@tanstack/eslint-plugin-query';
import { defineConfig } from 'eslint/config';

const config = defineConfig(
    { ignores: ['dist'] },
    {
        extends: [
            ...pluginQueryEslint.configs['flat/recommended'],
            jsEslint.configs.recommended,
            reactEslint.configs.flat.recommended,
            reactEslint.configs.flat['jsx-runtime'],
            reactRefreshEslint.configs.recommended,
            reactHooksEslint.configs.flat.recommended,
            jsxA11yEslint.flatConfigs.recommended,
            prettierEslintRecommended,
        ],
        files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2021,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: globals.browser,
        },
        settings: {
            react: {
                version: '18',
            },
        },
        rules: {
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
            'react-hooks/refs': 'off', // https://github.com/facebook/react/issues/34775

            'object-shorthand': 'warn',
            'no-console': 'warn',
            'no-unused-vars': 'off',
            'no-unused-expressions': 'off',
            'no-unreachable': 'warn',
            'prefer-template': 'off',

            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

            'react/prop-types': 'off', // currently bugs out when using React.FC, see https://github.com/jsx-eslint/eslint-plugin-react/issues/3873
            'react/display-name': 'off', // In most cases you don't need to set the displayName as it's inferred from the function/class name.
            'react/no-unknown-property': ['error', { ignore: ['onTransitionStart'] }], // https://github.com/jsx-eslint/eslint-plugin-react/issues/3993
        },
    },

    {
        files: ['**/*.{ts,tsx}'],
        extends: [...tsEslint.configs.recommendedTypeChecked],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    args: 'all',
                    argsIgnorePattern: '^_',
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/no-unused-expressions': ['error', { allowTernary: true, allowShortCircuit: true }],
        },
    },
);

export default config;
