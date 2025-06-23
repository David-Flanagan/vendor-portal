module.exports = {
  extends: [
    './base.js',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'next/core-web-vitals',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['jsx-a11y'],
  env: {
    browser: true,
    node: true, // Next.js runs both client and server side
    es6: true,
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
    next: {
      rootDir: true,
    },
  },
  rules: {
    // React specific - more relaxed for applications
    'react/react-in-jsx-scope': 'off', // Not needed in Next.js
    'react/prop-types': 'off', // Using TypeScript
    'react/jsx-uses-react': 'off', // Not needed in Next.js
    'react/require-default-props': 'off', // More relaxed for apps
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
    'react/display-name': 'warn', // More relaxed for apps
    'react/jsx-key': 'error',

    // React Hooks - more relaxed for applications
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn', // Warn instead of error for apps

    // Accessibility - important but not as strict as libraries
    'jsx-a11y/no-autofocus': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn',
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/label-has-associated-control': 'error',

    // TypeScript - more relaxed for applications
    '@typescript-eslint/explicit-function-return-type': ['warn', {
      allowExpressions: true,
      allowTypedFunctionExpressions: true,
      allowHigherOrderFunctions: true,
      allowDirectConstAssertionInArrowFunctions: true,
    }],
    '@typescript-eslint/explicit-module-boundary-types': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn', // Warn instead of error for apps
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],

    // Application specific - more relaxed
    'no-console': 'warn', // Allow console in development
    'no-debugger': 'warn',

    // Next.js specific
    '@next/next/no-img-element': 'warn', // Prefer Next.js Image component
    '@next/next/no-html-link-for-pages': 'error',

    // Import/export
    'import/no-anonymous-default-export': 'warn',
    'import/prefer-default-export': 'off',
  },
  overrides: [
    {
      // More relaxed rules for test files
      files: ['**/*.test.tsx', '**/*.test.ts', '**/*.spec.tsx', '**/*.spec.ts', '**/__tests__/**'],
      env: {
        jest: true,
      },
      rules: {
        'react/jsx-props-no-spreading': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        'no-console': 'off',
      },
    },
    {
      // More relaxed rules for Storybook files
      files: ['*.stories.tsx', '*.stories.ts'],
      rules: {
        'react/jsx-props-no-spreading': 'off',
        'react/display-name': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        'no-console': 'off',
      },
    },
    {
      // Next.js API routes
      files: ['pages/api/**/*.ts', 'app/api/**/*.ts'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    },
    {
      // Next.js configuration files
      files: ['next.config.js', 'next.config.mjs'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        'import/no-anonymous-default-export': 'off',
      },
    },
  ],
};