module.exports = {
  extends: ['@beach-box/eslint-config/base'],
  env: {
    node: true,
  },
  rules: {
    // ESLint config files-specific overrides
    '@typescript-eslint/no-var-requires': 'off', // Config files use require()
    'no-console': 'off', // Config files may log
  },
};