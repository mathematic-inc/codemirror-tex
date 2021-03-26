module.exports = {
  root: true,
  extends: '@mu-io',
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    // Private fields
    '@typescript-eslint/explicit-member-accessibility': 0,
    // We use this sparingly.
    'no-nested-ternary': 0,
    // We use this sparingly.
    'no-continue': 0,
    // Common for private fields that should not be touched by anything except a proxy.
    'no-underscore-dangle': 0,
    // Auxillary classes are common.
    'max-classes-per-file': 0,
    // In loops and generator functions.
    'no-plusplus': 0,
    // Immer
    'no-param-reassign': 0,
    // Bitwise is faster
    'no-bitwise': 0,
    // People will know when to use it.
    'import/prefer-default-export': 0,
    // People will know when to use it.
    'default-case': 0,
  },
};
