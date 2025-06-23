# @beach-box/eslint-config

Shared ESLint configuration for the Beach Box monorepo, providing consistent code quality standards and best practices across all applications and packages.

## Overview

This package contains standardized ESLint configurations for different project types within the Beach Box monorepo. It enforces consistent code style, catches common errors, and promotes best practices across TypeScript, React, and Vite applications.

## Features

- **Multiple Configurations**: Tailored configs for different project types
- **TypeScript Support**: Full TypeScript integration with type-aware rules
- **React Integration**: React-specific rules and best practices
- **Vite Support**: Optimized configuration for Vite applications
- **Import Organization**: Automatic import sorting and organization
- **Code Quality**: Rules for code consistency and error prevention
- **Performance**: Optimized rule sets for fast linting

## Installation

```bash
pnpm add -D @beach-box/eslint-config
```

## Available Configurations

### Base Configuration (`base.js`)

Core ESLint rules for all JavaScript/TypeScript projects:

```javascript
// .eslintrc.js
module.exports = {
  extends: ['@beach-box/eslint-config/base'],
};
```

**Includes:**
- Core ESLint recommended rules
- TypeScript ESLint rules with type checking
- Import/export rules and sorting
- Promise handling rules
- Security-focused rules
- Performance optimizations

### React Configuration (`react-vite.js`)

Specialized configuration for React + Vite applications:

```javascript
// .eslintrc.js
module.exports = {
  extends: ['@beach-box/eslint-config/react-vite'],
};
```

**Includes:**
- All base configuration rules
- React recommended rules
- React Hooks rules
- JSX accessibility rules
- React performance rules
- Vite-specific optimizations
- Tailwind CSS class sorting

### React Library Configuration (`react-lib.js`)

Configuration for React component libraries:

```javascript
// .eslintrc.js
module.exports = {
  extends: ['@beach-box/eslint-config/react-lib'],
};
```

**Includes:**
- All base configuration rules
- React library best practices
- Component export patterns
- TypeScript strict mode
- Tree-shaking friendly patterns

### Node Library Configuration (`node-lib.js`)

Configuration for Node.js libraries and utilities:

```javascript
// .eslintrc.js
module.exports = {
  extends: ['@beach-box/eslint-config/node-lib'],
};
```

**Includes:**
- All base configuration rules
- Node.js environment settings
- CommonJS and ES modules support
- Library-specific patterns
- Export conventions

## Usage Examples

### Beach Box Landing Page

```javascript
// apps/beach-box-landing/.eslintrc.js
module.exports = {
  extends: ['@beach-box/eslint-config/react-vite'],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    // Project-specific overrides for Beach Box
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
  },
};
```

### Unify UI Component Library

```javascript
// packages/unify-ui/.eslintrc.js
module.exports = {
  extends: ['@beach-box/eslint-config/react-lib'],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    // Component library specific rules
    'react/prop-types': 'off', // Using TypeScript for props
  },
};
```

### Shared Schemas Package

```javascript
// shared/schemas/.eslintrc.js
module.exports = {
  extends: ['@beach-box/eslint-config/node-lib'],
  parserOptions: {
    project: './tsconfig.json',
  },
  env: {
    node: true,
  },
};
```

## Rule Categories

### TypeScript Rules

```javascript
// Type safety and best practices
'@typescript-eslint/no-unused-vars': 'error',
'@typescript-eslint/no-explicit-any': 'warn',
'@typescript-eslint/prefer-nullish-coalescing': 'error',
'@typescript-eslint/prefer-optional-chain': 'error',
'@typescript-eslint/no-floating-promises': 'error',
'@typescript-eslint/await-thenable': 'error',
```

### Import Rules

```javascript
// Import organization and optimization
'import/order': ['error', {
  groups: [
    'builtin',
    'external',
    'internal',
    'parent',
    'sibling',
    'index',
  ],
  'newlines-between': 'always',
  alphabetize: { order: 'asc' },
}],
'import/no-duplicates': 'error',
'import/no-unused-modules': 'warn',
```

### React Rules

```javascript
// React best practices
'react/react-in-jsx-scope': 'off', // Not needed with React 17+
'react/prop-types': 'off', // Using TypeScript instead
'react-hooks/rules-of-hooks': 'error',
'react-hooks/exhaustive-deps': 'warn',
'jsx-a11y/alt-text': 'error',
'jsx-a11y/aria-role': 'error',
```

### Code Quality Rules

```javascript
// General code quality
'no-console': 'warn',
'no-debugger': 'error',
'prefer-const': 'error',
'no-var': 'error',
'object-shorthand': 'error',
'prefer-arrow-callback': 'error',
```

## Custom Rules

### Business Logic Rules

The configuration includes custom rules specific to beach Box business logic:

```javascript
// Custom rules for beach Box patterns
'beach-box/prefer-unify-ui-components': 'warn',
'beach-box/no-direct-api-calls': 'error',
'beach-box/require-error-boundaries': 'warn',
```

### Security Rules

```javascript
// Security-focused rules
'security/detect-object-injection': 'error',
'security/detect-non-literal-regexp': 'warn',
'security/detect-unsafe-regex': 'error',
```

## Configuration Options

### Parser Options

```javascript
// Recommended parser options
{
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true,
    },
  },
}
```

### Environment Settings

```javascript
// Common environments
{
  env: {
    browser: true,  // For frontend apps
    node: true,     // For backend apps
    es2022: true,   // Modern JavaScript features
    jest: true,     // Testing environment
  },
}
```

## Integration with Development Tools

### VS Code Integration

Create `.vscode/settings.json`:

```json
{
  "eslint.workingDirectories": ["apps/*", "packages/*"],
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### Prettier Integration

The configuration is designed to work with Prettier:

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    '@beach-box/eslint-config/react',
    'prettier', // Disables conflicting rules
  ],
};
```

### Pre-commit Hooks

Use with `lint-staged` for pre-commit linting:

```json
// package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

## Performance Optimization

### Caching

```javascript
// .eslintrc.js
module.exports = {
  extends: ['@beach-box/eslint-config/react'],
  cache: true,
  cacheLocation: 'node_modules/.cache/eslint',
};
```

### Selective Linting

```javascript
// Only lint changed files in development
{
  "scripts": {
    "lint": "eslint src --ext .ts,.tsx --cache",
    "lint:fix": "eslint src --ext .ts,.tsx --cache --fix",
    "lint:ci": "eslint src --ext .ts,.tsx --max-warnings 0"
  }
}
```

## Troubleshooting

### Common Issues

#### TypeScript Project Reference Issues

```javascript
// If you have multiple tsconfig files
{
  parserOptions: {
    project: ['./tsconfig.json', './tsconfig.node.json'],
  },
}
```

#### Monorepo Path Resolution

```javascript
// For import resolution in monorepos
{
  settings: {
    'import/resolver': {
      typescript: {
        project: ['apps/*/tsconfig.json', 'packages/*/tsconfig.json'],
      },
    },
  },
}
```

#### Performance Issues

```javascript
// Exclude large directories
{
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    '.next/',
    'coverage/',
    '*.min.js',
  ],
}
```

## Customization

### Project-Specific Overrides

```javascript
// .eslintrc.js
module.exports = {
  extends: ['@beach-box/eslint-config/react'],
  rules: {
    // Disable specific rules for this project
    '@typescript-eslint/no-explicit-any': 'off',

    // Customize rule severity
    'no-console': 'error',

    // Add project-specific rules
    'prefer-const': 'error',
  },
  overrides: [
    {
      files: ['**/*.test.{ts,tsx}'],
      rules: {
        // Test-specific rule overrides
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
};
```

### Directory-Specific Rules

```javascript
// Different rules for different directories
{
  overrides: [
    {
      files: ['src/components/**/*.{ts,tsx}'],
      rules: {
        'beach-box/prefer-unify-ui-components': 'error',
      },
    },
    {
      files: ['src/pages/**/*.{ts,tsx}'],
      rules: {
        'react/display-name': 'off',
      },
    },
  ],
}
```

## Contributing

### Adding New Rules

1. **Evaluate Need**: Ensure the rule adds value and doesn't conflict
2. **Test Impact**: Run against existing codebase to check for issues
3. **Documentation**: Document the rule's purpose and examples
4. **Gradual Rollout**: Start with 'warn' before promoting to 'error'

### Rule Categories

- **Error**: Prevent bugs and critical issues
- **Warn**: Code quality and best practices
- **Off**: Disabled rules (with justification)

## Migration Guide

### From Other Configs

When migrating from other ESLint configurations:

1. **Install Package**:
   ```bash
   pnpm add -D @beach-box/eslint-config
   ```

2. **Update Configuration**:
   ```javascript
   // Before
   extends: ['eslint:recommended', '@typescript-eslint/recommended']

   // After
   extends: ['@beach-box/eslint-config/react']
   ```

3. **Fix Violations**:
   ```bash
   pnpm lint --fix
   ```

4. **Handle Remaining Issues**:
   - Review remaining violations
   - Add project-specific overrides if needed
   - Update code to match new standards

## Scripts

Common package.json scripts:

```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx --cache",
    "lint:fix": "eslint . --ext .ts,.tsx --cache --fix",
    "lint:ci": "eslint . --ext .ts,.tsx --max-warnings 0",
    "lint:report": "eslint . --ext .ts,.tsx --format json --output-file eslint-report.json"
  }
}
```

## License

Private - Part of beach Box Monorepo