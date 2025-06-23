module.exports = {
  extends: [
    './base.js',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:storybook/recommended',
  ],
  plugins: ['jsx-a11y'],
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
    'react/require-default-props': ['error', {
      functions: 'defaultArguments',
    }],
    'react/jsx-boolean-value': ['error', 'never'],
    'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
    'react/self-closing-comp': 'error',
    'react/jsx-sort-props': ['error', {
      callbacksLast: true,
      shorthandFirst: true,
      noSortAlphabetically: false,
      reservedFirst: true,
    }],
    'react/function-component-definition': ['error', {
      namedComponents: 'arrow-function',
      unnamedComponents: 'arrow-function',
    }],
    'react/jsx-pascal-case': 'error',
    'react/jsx-no-useless-fragment': 'error',
    'react/jsx-no-duplicate-props': 'error',
    'react/display-name': 'error',
    'react/jsx-key': 'error',

    // React Hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',

    // Accessibility - stricter for libraries
    'jsx-a11y/no-autofocus': 'error',
    'jsx-a11y/no-static-element-interactions': 'error',
    'jsx-a11y/click-events-have-key-events': 'error',

    // TypeScript stricter rules for libraries
    '@typescript-eslint/explicit-function-return-type': ['error', {
      allowExpressions: true,
      allowTypedFunctionExpressions: true,
      allowHigherOrderFunctions: true,
      allowDirectConstAssertionInArrowFunctions: true,
    }],
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',

    // Library specific
    'no-console': 'error',
    'no-debugger': 'error',

    // Note: @typescript-eslint/require-jsdoc was deprecated and removed in v6
    // Consider using tsdoc or other documentation tools for API documentation
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
        'react/display-name': 'off',
        'no-console': 'off',
      },
    },
  ],
};