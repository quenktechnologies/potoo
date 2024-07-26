module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './src/tsconfig.json'
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended'
    ],
    ignorePatterns: ['.eslintrc.js', 'register.js', 'test/browser/mocha.js'],
    plugins: ['@typescript-eslint', 'prettier'],
    rules: {
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-this-alias': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        'no-unused-vars': 'off',
        'require-yield': 'off',
        'prefer-const': 'off'
    }
};
