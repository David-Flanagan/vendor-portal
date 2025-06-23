module.exports = {
  extends: ['@beach-box/eslint-config/react-lib', 'plugin:storybook/recommended'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    // Component library-specific overrides can go here
  },
};