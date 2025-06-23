module.exports = {
  extends: ['@beach-box/eslint-config/react-vite'],
  parserOptions: {
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
  rules: {
    // App-specific overrides can go here
  },
};