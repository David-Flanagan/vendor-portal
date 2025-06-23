module.exports = {
  extends: ['./base.js'],
  env: {
    node: true,
    es2021: true,
  },
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  rules: {
    // NestJS specific rules
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    // Allow decorators
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/parameter-properties': 'off',

    // NestJS common patterns
    '@typescript-eslint/no-empty-function': 'off',
    'class-methods-use-this': 'off',

    // Database entity specific
    '@typescript-eslint/no-non-null-assertion': 'warn',

    // Allow process.exit in main.ts bootstrapping
    'no-process-exit': 'off',

    // Less strict for development
    'no-console': ['warn', { allow: ['warn', 'error', 'debug'] }],
  },
  overrides: [
    {
      files: ['src/main.ts', 'src/migrations/*.ts'],
      rules: {
        'no-process-exit': 'off',
      },
    },
    {
      files: ['**/*.entity.ts', '**/*.dto.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
    },
  ],
  ignorePatterns: [
    'dist/',
    'node_modules/',
    '*.js',
    'migrations/*.js',
    'coverage/',
    '.eslintrc.js',
  ],
};