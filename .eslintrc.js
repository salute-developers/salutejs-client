module.exports = {
    extends: ['prettier'],
    parser: '@typescript-eslint/parser',
    plugins: ['import', 'prettier', 'cypress', '@typescript-eslint'],
    rules: {
        camelcase: 'error',
        'spaced-comment': ['error', 'always', { markers: ['/'] }], /// разрешаем ts-require directive
        'comma-dangle': ['error', 'always-multiline'],
        'arrow-parens': ['error', 'always'],

        'space-before-function-paren': [
            'error',
            {
                anonymous: 'never',
                named: 'never',
                asyncArrow: 'always',
            },
        ],
        indent: 'off',
        'max-len': [
            'error',
            120,
            2,
            {
                ignoreUrls: true,
                ignoreComments: false,
                ignoreRegExpLiterals: true,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
            },
        ],
        'padding-line-between-statements': [
            'error',
            { blankLine: 'always', prev: '*', next: 'return' },
            { blankLine: 'always', prev: '*', next: 'if' },
        ],
        'implicit-arrow-linebreak': 'off',
        'no-plusplus': 'off',
        'max-classes-per-file': 'off',
        'operator-linebreak': 'off',
        'object-curly-newline': 'off',
        'class-methods-use-this': 'off',
        'no-confusing-arrow': 'off',
        'function-paren-newline': 'off',
        'no-param-reassign': 'off',
        'no-shadow': 'warn',
        'space-before-function-paren': 'off',
        'consistent-return': 'off',
        'prettier/prettier': 'error',

        '@typescript-eslint/explicit-function-return-type': 'off',

        'jsx-a11y/no-static-element-interactions': 'off',
        'jsx-a11y/click-events-have-key-events': 'off',
        'jsx-a11y/no-noninteractive-tabindex': 'off',

        'import/prefer-default-export': 'off', // @grape: https://humanwhocodes.com/blog/2019/01/stop-using-default-exports-javascript-module/
        'import/order': [
            'error',
            {
                groups: [['builtin', 'external'], 'internal', 'parent', 'sibling', 'index'],
                'newlines-between': 'always',
            },
        ],
        'import/no-unresolved': 'off',
        'import/extensions': 'off',
        'import/no-extraneous-dependencies': ['off'], //можно включить тока нужно резолвы разрулить
        'arrow-body-style': 'off',
        'padding-line-between-statements': 'off',
        'no-unused-expressions': 'off',
        '@typescript-eslint/no-empty-function': 'off',
    },
};
