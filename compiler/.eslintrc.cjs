/* eslint-disable */
module.exports = {
    // REF: https://typescript-eslint.io/docs/linting/
    'root': true,
    'parser': '@typescript-eslint/parser',
    'plugins': [
        '@typescript-eslint',
    ],
    'extends': [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    'rules': {
        'semi': [
            'warn',
            'always'
        ],
        'quotes': [
            'warn',
            'single'
        ],
        'comma-dangle': [
            'warn',
            'always-multiline'
        ],
        '@typescript-eslint/no-unused-vars': [
            'warn', {
                'varsIgnorePattern': '^_',
                'argsIgnorePattern': '^_',
                'caughtErrorsIgnorePattern': '^_'
            }
        ]
    }
};