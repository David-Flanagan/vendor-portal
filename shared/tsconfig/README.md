# @beach-box/tsconfig

Shared TypeScript configurations for the Beach Box monorepo, providing consistent compiler settings, build optimization, and type checking across all applications and packages.

## Overview

This package contains standardized TypeScript configurations for different project types within the Beach Box monorepo. It ensures consistent compilation settings, optimal performance, and proper type checking across all applications and libraries.

## Features

- **Multiple Configurations**: Tailored configs for different project types
- **Optimized Builds**: Performance-tuned compiler settings
- **Strict Type Checking**: Comprehensive type safety rules
- **Modern JavaScript**: Support for latest ECMAScript features
- **Monorepo Support**: Path mapping and project references
- **Build Optimization**: Fast incremental builds and caching

## Installation

```bash
pnpm add -D @beach-box/tsconfig
```

## Available Configurations

### Base Configuration (`base.json`)

Core TypeScript settings for all projects:

```json
// tsconfig.json
{
  "extends": "@beach-box/tsconfig/base.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Features:**
- Strict type checking enabled
- Modern JavaScript target (ES2022)
- Path mapping for monorepo packages
- Optimized build settings
- Comprehensive lib references

### React Vite Configuration (`react-vite.json`)

Specialized configuration for React + Vite applications:

```json
// tsconfig.json
{
  "extends": "@beach-box/tsconfig/react-vite.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src/**/*", "vite.config.ts"],
  "exclude": ["node_modules", "dist", "build"]
}
```

**Features:**
- All base configuration settings
- JSX support with React 17+ transform
- DOM and DOM.Iterable lib references
- Vite-specific optimizations
- React-specific type checking

### React Library Configuration (`react.json`)

Configuration for React component libraries:

```json
// tsconfig.json
{
  "extends": "@beach-box/tsconfig/react.json",
  "compilerOptions": {
    "outDir": "./dist",
    "declarationDir": "./dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.*", "**/*.stories.*"]
}
```

**Features:**
- All base configuration settings
- JSX support for component libraries
- Declaration file generation
- Tree-shaking friendly settings
- Storybook exclusions

### Node Library Configuration (`node.json`)

Configuration for Node.js libraries and utilities:

```json
// tsconfig.json
{
  "extends": "@beach-box/tsconfig/node.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Features:**
- All base configuration settings
- Node.js environment settings
- CommonJS and ESM module support
- Node.js-specific lib references
- Server-side optimizations

## Configuration Details

### Base Configuration Settings

```json
{
  "compilerOptions": {
    // Language and Environment
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ESNext",
    "moduleResolution": "bundler",

    // Type Checking
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,

    // Module Resolution
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,

    // Emit
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": false,

    // Interop Constraints
    "isolatedModules": true,
    "allowImportingTsExtensions": true,
    "noEmit": true,

    // Performance
    "skipLibCheck": true,
    "incremental": true
  }
}
```

### React Vite Specific Settings

Additional settings for React + Vite applications:

```json
{
  "compilerOptions": {
    // React JSX
    "jsx": "react-jsx",
    "jsxImportSource": "react",

    // DOM Environment
    "lib": ["ES2022", "DOM", "DOM.Iterable"],

    // Vite Specific
    "types": ["vite/client"],
    "allowImportingTsExtensions": true,
    "noEmit": true,

    // Path Mapping
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### React Library Specific Settings

Additional settings for React component libraries:

```json
{
  "compilerOptions": {
    // Library Build
    "declaration": true,
    "declarationMap": true,
    "emitDeclarationOnly": false,

    // JSX for Libraries
    "jsx": "react-jsx",
    "jsxImportSource": "react",

    // Tree Shaking
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,

    // External Dependencies
    "skipLibCheck": true
  }
}
```

## Usage Examples

### Beach Box Landing Page

```json
// apps/beach-box-landing/tsconfig.json
{
  "extends": "@beach-box/tsconfig/react-vite.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@beach-box/unify-ui": ["../packages/unify-ui/src"]
    }
  },
  "include": [
    "src/**/*",
    "vite.config.ts"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```

### Unify UI Component Library

```json
// packages/unify-ui/tsconfig.json
{
  "extends": "@beach-box/tsconfig/react.json",
  "compilerOptions": {
    "outDir": "./dist",
    "declarationDir": "./dist/types",
    "rootDir": "./src",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.test.*",
    "**/*.stories.*",
    "storybook-static"
  ]
}
```

### Shared Schemas Package

```json
// shared/schemas/tsconfig.json
{
  "extends": "@beach-box/tsconfig/node.json",
  "compilerOptions": {
    "outDir": "./dist",
    "declarationDir": "./dist",
    "rootDir": "./src"
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.test.*"
  ]
}
```

### Shared ESLint Config Package

```json
// shared/eslint-config/tsconfig.json
{
  "extends": "@beach-box/tsconfig/node.json",
  "compilerOptions": {
    "outDir": "./dist",
    "declarationDir": "./dist",
    "rootDir": "./src"
  },
  "include": [
    "src/**/*",
    "*.js"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```

## Path Mapping

### Monorepo Package References

Configure path mapping to reference other packages in the monorepo:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@beach-box/unify-ui": ["../packages/unify-ui/src"],
      "@beach-box/schemas": ["../shared/schemas/src"],
      "@beach-box/eslint-config": ["../shared/eslint-config/src"]
    }
  }
}
```

### Internal Path Mapping

Set up convenient internal path aliases:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/utils/*": ["./src/lib/utils/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/types/*": ["./src/types/*"]
    }
  }
}
```

## Performance Optimization

### Build Performance

Optimize TypeScript compilation for faster builds:

```json
{
  "compilerOptions": {
    // Skip type checking for node_modules
    "skipLibCheck": true,

    // Enable incremental compilation
    "incremental": true,
    "tsBuildInfoFile": ".tsbuildinfo",

    // Optimize module resolution
    "moduleResolution": "bundler",

    // Reduce memory usage
    "preserveWatchOutput": true
  },

  // Exclude unnecessary files
  "exclude": [
    "node_modules",
    "dist",
    "build",
    "**/*.test.*",
    "**/*.spec.*"
  ]
}
```

### Development Performance

Settings for optimal development experience:

```json
{
  "compilerOptions": {
    // Fast refresh for development
    "isolatedModules": true,

    // No emit during development (handled by Vite)
    "noEmit": true,

    // Preserve imports for better tree shaking
    "preserveValueImports": true,

    // Modern module resolution
    "moduleResolution": "bundler"
  }
}
```

## Project References

For large monorepos, use TypeScript project references:

```json
// Root tsconfig.json
{
  "files": [],
  "references": [
    { "path": "./apps/beach-box-landing" },
    { "path": "./packages/unify-ui" },
    { "path": "./shared/schemas" },
    { "path": "./shared/eslint-config" }
  ]
}
```

Each referenced project should have:

```json
{
  "extends": "@beach-box/tsconfig/react-vite.json",
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "declarationMap": true
  }
}
```

## Troubleshooting

### Common Issues

1. **Module Resolution Errors**
   - Ensure `moduleResolution` is set to `"bundler"` for modern bundlers
   - Check path mappings in `paths` configuration

2. **JSX Errors**
   - Verify `jsx` is set to `"react-jsx"` for React 17+
   - Check `jsxImportSource` is set correctly

3. **Build Performance**
   - Enable `skipLibCheck` to skip type checking of declaration files
   - Use `incremental` compilation for faster rebuilds

4. **Monorepo Issues**
   - Set up proper project references
   - Configure path mappings for internal packages

### Best Practices

1. **Extend Base Configs**: Always extend from base configurations
2. **Minimal Overrides**: Only override settings when necessary
3. **Consistent Settings**: Use the same configuration for similar project types
4. **Path Mappings**: Use path mappings for cleaner imports
5. **Exclude Patterns**: Properly exclude build artifacts and test files

---

**Part of the Beach Box Monorepo** 🏖️