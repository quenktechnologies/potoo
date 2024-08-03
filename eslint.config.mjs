import eslint from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

export default [
    {
        files: ['src', 'test']
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        languageOptions: {
            globals: globals.node,
            ecmaVersion: 2020,
            sourceType: 'module'
        },

        rules: {
            '@typescript-eslint/ban-types': 'off',
            '@typescript-eslint/no-this-alias': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-wrapper-object-types': 'off',
            '@typescript-eslint/no-unsafe-function-type': 'off',
            'no-unused-vars': 'off',
            'require-yield': 'off',
            'prefer-const': 'off'
        }
    }
];
