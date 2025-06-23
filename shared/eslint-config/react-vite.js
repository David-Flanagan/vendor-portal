module.exports = {
  extends: [
    './base.js',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  plugins: ['react-refresh', 'jsx-a11y'],
  env: {
    browser: true,
    node: false,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // React specific
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/jsx-uses-react': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off',
    'react/jsx-boolean-value': ['error', 'never'],
    'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
    'react/self-closing-comp': 'error',
    'react/jsx-sort-props': [
      'error',
      {
        callbacksLast: true,
        shorthandFirst: true,
        noSortAlphabetically: false,
        reservedFirst: true,
      },
    ],
    'react/jsx-pascal-case': 'error',
    'react/jsx-no-useless-fragment': 'error',
    'react/jsx-no-duplicate-props': 'error',

    // React Hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // Vite specific
    'react-refresh/only-export-components': [
      'warn',
      {
        allowConstantExport: true,
      },
    ],

    // Accessibility
    'jsx-a11y/anchor-is-valid': 'error',

    // Relax some rules for apps
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    'react/no-unescaped-entities': 'off',
  },
  overrides: [
    {
      files: ['**/*.test.tsx', '**/*.test.ts', '**/*.spec.tsx', '**/*.spec.ts', '**/__tests__/**'],
      env: {
        jest: true,
      },
      rules: {
        'react/jsx-props-no-spreading': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'no-console': 'off',
      },
    },
    {
      files: ['*.stories.tsx', '*.stories.ts'],
      rules: {
        'react/jsx-props-no-spreading': 'off',
        'no-console': 'off',
      },
    },
  ],
};
