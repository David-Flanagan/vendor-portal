# @beach-box/tsconfig

Shared TypeScript configurations for the beach Box monorepo, providing consistent compiler settings, build optimization, and type checking across all applications and packages.

## Overview

This package contains standardized TypeScript configurations for different project types within the beach Box monorepo. It ensures consistent compilation settings, optimal performance, and proper type checking across all applications and libraries.

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

### React Configuration (`react.json`)

Specialized configuration for React applications:

```json
// tsconfig.json
{
  "extends": "@beach-box/tsconfig/react.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "build"]
}
```

**Features:**
- All base configuration settings
- JSX support with React 17+ transform
- DOM and DOM.Iterable lib references
- Optimized for bundlers (Vite, Webpack)
- React-specific type checking

### Node.js Configuration (`node.json`)

Configuration for Node.js applications and APIs:

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

### NestJS Configuration (`nestjs.json`)

Specialized configuration for NestJS applications:

```json
// tsconfig.json
{
  "extends": "@beach-box/tsconfig/nestjs.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Features:**
- All Node.js configuration settings
- Decorator support enabled
- Reflection metadata support
- Class-based architecture optimizations
- NestJS-specific compiler options

### Library Configuration (`library.json`)

Configuration for shared libraries and packages:

```json
// tsconfig.json
{
  "extends": "@beach-box/tsconfig/library.json",
  "compilerOptions": {
    "outDir": "./dist",
    "declarationDir": "./dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.*"]
}
```

**Features:**
- All base configuration settings
- Declaration file generation
- Multiple output formats support
- Tree-shaking friendly settings
- Library-specific optimizations

### Next.js Configuration (`nextjs.json`)

Specialized configuration for Next.js applications:

```json
// tsconfig.json
{
  "extends": "@beach-box/tsconfig/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

**Features:**
- Next.js optimized settings
- App Router support
- Server Components support
- Incremental compilation
- Next.js-specific path mapping

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
    "importHelpers": true,

    // Interop Constraints
    "isolatedModules": true,
    "allowImportingTsExtensions": false,
    "noEmit": false,

    // Performance
    "skipLibCheck": true,
    "incremental": true,
    "tsBuildInfoFile": ".tsbuildinfo"
  }
}
```

### Path Mapping

Monorepo path mapping for internal packages:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@beach-box/unify-ui": ["../../packages/unify-ui/src"],
      "@beach-box/unify-ui/*": ["../../packages/unify-ui/src/*"],
      "@beach-box/core-api-client": ["../../packages/core-api-client/src"],
      "@beach-box/core-api-types": ["../../packages/core-api-types/src"],
      "@beach-box/schemas": ["../../shared/schemas/src"],
      "@/*": ["./src/*"]
    }
  }
}
```

## Usage Examples

### React Application

```json
// apps/broker-portal-ui/tsconfig.json
{
  "extends": "@beach-box/tsconfig/react.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/hooks/*": ["./src/hooks/*"]
    }
  },
  "include": [
    "src/**/*",
    "**/*.d.ts"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "build"
  ]
}
```

### Node.js API

```json
// apps/EPM-CORE-API/tsconfig.json
{
  "extends": "@beach-box/tsconfig/node.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/modules/*": ["./src/modules/*"],
      "@/utils/*": ["./src/utils/*"]
    }
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

### Shared Package

```json
// packages/unify-ui/tsconfig.json
{
  "extends": "@beach-box/tsconfig/library.json",
  "compilerOptions": {
    "outDir": "./dist",
    "declarationDir": "./dist",
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
    "**/*.stories.*"
  ]
}
```

### NestJS Application

```json
// apps/enterprise-api/tsconfig.json
{
  "extends": "@beach-box/tsconfig/nestjs.json",
  "compilerOptions": {
    "outDir": "./dist",
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
    "test/**/*"
  ]
}
```

## Build Configurations

### Development Build

```json
// tsconfig.dev.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "sourceMap": true,
    "removeComments": false,
    "noEmit": false,
    "incremental": true
  },
  "include": [
    "src/**/*",
    "**/*.d.ts"
  ]
}
```

### Production Build

```json
// tsconfig.build.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "sourceMap": false,
    "removeComments": true,
    "declaration": false,
    "incremental": false
  },
  "exclude": [
    "node_modules",
    "**/*.test.*",
    "**/*.spec.*",
    "**/*.stories.*"
  ]
}
```

### Testing Configuration

```json
// tsconfig.test.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noEmit": true,
    "types": ["jest", "node"]
  },
  "include": [
    "src/**/*",
    "**/*.test.*",
    "**/*.spec.*"
  ]
}
```

## Type Definitions

### Global Type Definitions

```typescript
// types/global.d.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      API_URL: string;
      DATABASE_URL: string;
    }
  }
}

export {};
```

### Module Augmentations

```typescript
// types/modules.d.ts
declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.json' {
  const value: any;
  export default value;
}
```

## Compiler Options Explained

### Type Checking Options

```json
{
  "strict": true,                           // Enable all strict checks
  "noImplicitAny": true,                   // Error on implicit 'any' types
  "strictNullChecks": true,                // Strict null/undefined checking
  "strictFunctionTypes": true,             // Strict function type checking
  "noImplicitReturns": true,               // Error on missing return statements
  "noFallthroughCasesInSwitch": true,      // Error on fallthrough cases
  "noUncheckedIndexedAccess": true,        // Check array/object access
  "exactOptionalPropertyTypes": true        // Exact optional property types
}
```

### Module Resolution Options

```json
{
  "moduleResolution": "bundler",            // Modern bundler resolution
  "esModuleInterop": true,                  // CommonJS/ES modules interop
  "allowSyntheticDefaultImports": true,     // Allow default imports
  "resolveJsonModule": true,                // Import JSON files
  "allowImportingTsExtensions": false       // Disallow .ts extensions in imports
}
```

### Emit Options

```json
{
  "declaration": true,                      // Generate .d.ts files
  "declarationMap": true,                   // Generate .d.ts.map files
  "sourceMap": true,                        // Generate source maps
  "outDir": "./dist",                       // Output directory
  "removeComments": false,                  // Keep comments in output
  "importHelpers": true                     // Use tslib helpers
}
```

## Performance Optimization

### Incremental Compilation

```json
{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": ".tsbuildinfo",
    "composite": true
  }
}
```

### Project References

```json
{
  "references": [
    { "path": "./packages/unify-ui" },
    { "path": "./packages/core-api-types" },
    { "path": "./shared/schemas" }
  ]
}
```

### Skip Lib Check

```json
{
  "compilerOptions": {
    "skipLibCheck": true,  // Skip type checking of declaration files
    "skipDefaultLibCheck": true
  }
}
```

## IDE Integration

### VS Code Settings

```json
// .vscode/settings.json
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "typescript.suggest.autoImports": true,
  "typescript.updateImportsOnFileMove.enabled": "always",
  "typescript.inlayHints.parameterNames.enabled": "all",
  "typescript.inlayHints.variableTypes.enabled": true,
  "typescript.inlayHints.functionLikeReturnTypes.enabled": true
}
```

### Path Mapping in VS Code

```json
// .vscode/settings.json
{
  "typescript.preferences.useAliasesForRenames": false,
  "typescript.suggest.includeAutomaticOptionalChainCompletions": true
}
```

## Troubleshooting

### Common Issues

#### Module Resolution Issues

```json
// Fix: Update module resolution
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": false
  }
}
```

#### Path Mapping Not Working

```json
// Fix: Ensure baseUrl is set
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

#### Build Performance Issues

```json
// Fix: Enable incremental builds
{
  "compilerOptions": {
    "incremental": true,
    "skipLibCheck": true
  }
}
```

### Memory Issues

```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=8192"

# Or use in package.json scripts
"build": "node --max-old-space-size=8192 ./node_modules/typescript/bin/tsc"
```

## Migration Guide

### From JavaScript to TypeScript

1. **Install TypeScript**:
   ```bash
   pnpm add -D typescript @beach-box/tsconfig
   ```

2. **Create tsconfig.json**:
   ```json
   {
     "extends": "@beach-box/tsconfig/react.json"
   }
   ```

3. **Rename files**: `.js` → `.ts`, `.jsx` → `.tsx`

4. **Add type annotations**: Start with `any`, gradually add specific types

5. **Fix type errors**: Address TypeScript compiler errors

### From Other Configs

1. **Compare settings**: Review differences between configs
2. **Update extends**: Change to use `@beach-box/tsconfig`
3. **Merge custom settings**: Add project-specific overrides
4. **Test build**: Ensure compilation works correctly

## Scripts

Common package.json scripts:

```json
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "type-check:watch": "tsc --noEmit --watch",
    "build": "tsc",
    "build:watch": "tsc --watch",
    "clean": "rm -rf dist .tsbuildinfo"
  }
}
```

## Best Practices

### File Organization

```
src/
├── types/          # Type definitions
├── utils/          # Utility functions
├── components/     # React components
├── hooks/          # Custom hooks
├── services/       # API services
├── constants/      # App constants
└── index.ts        # Main entry point
```

### Type Definition Guidelines

- Use interfaces for objects that might be extended
- Use types for unions, primitives, and computed types
- Prefer readonly for immutable data
- Use const assertions for literal types
- Document complex types with JSDoc comments

### Import Organization

```typescript
// 1. Node modules
import React from 'react';
import axios from 'axios';

// 2. Internal packages
import { Button } from '@beach-box/unify-ui';
import { UserSchema } from '@beach-box/schemas';

// 3. Relative imports
import { useAuth } from '../hooks/useAuth';
import { formatDate } from './utils';
```

## License

Private - Part of beach Box Monorepo