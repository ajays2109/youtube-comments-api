import eslintPluginTs from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: './tsconfig.json',
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
        plugins: {
            '@typescript-eslint': eslintPluginTs,
        },
        rules: {
            'semi': ['error', 'always'],             // enforce semicolons
            'quotes': ['error', 'single'],           // enforce single quotes
            'indent': ['error', 2],                  // enforce 2-space indentation
            'comma-dangle': ['error', 'always-multiline'], // trailing commas
            'space-before-function-paren': ['error', 'never'],
            ...eslintPluginTs.configs.recommended.rules,
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/ban-ts-comment': 'warn',
        },
        ignores: ['dist', 'node_modules'],
    },
];
