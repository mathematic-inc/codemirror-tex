module.exports = {
  root: true,
  extends: '@mu-io',
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    // Bitwise is faster
    'no-bitwise': 0,
    // People will know when to use it.
    'import/prefer-default-export': 0,
    // People will know when to use it.
    'default-case': 0,
  },
};
