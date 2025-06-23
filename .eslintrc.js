module.exports = {
  root: true,
  extends: ['@beach-box/eslint-config/base'],
  ignorePatterns: [
    'node_modules',
    'dist',
    'build',
    '.turbo',
    '*.min.js',
    'coverage',
    '.next',
    'out',
  ],
  overrides: [
    // Node.js files in root
    {
      files: ['*.js', '*.ts'],
      env: {
        node: true,
        browser: false,
      },
    },
    // Configuration files
    {
      files: ['**/*.config.js', '**/*.config.ts', '**/.*rc.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        'no-console': 'off',
      },
    },
  ],
};
