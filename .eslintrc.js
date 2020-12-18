module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "airbnb-base",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/typescript",
    "plugin:prettier/recommended",
    "prettier/@typescript-eslint",
  ],
  plugins: ["tsdoc", "padding"],
  parser: "@typescript-eslint/parser",
  rules: {
    /* ************************************************************************** */
    /*                             TYPESCRIPT SETTINGS                            */
    /* ************************************************************************** */
    "tsdoc/syntax": "error",
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": "error",
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": "error",
    "@typescript-eslint/member-ordering": [
      "error",
      {
        default: [
          /* ************************************************************************** */
          /*                                   STATICS                                  */
          /* ************************************************************************** */
          // Fields
          "static-field",
          "public-static-field",
          "protected-static-field",
          "private-static-field",

          // Methods
          "static-method",
          "public-static-method",
          "protected-static-method",
          "private-static-method",
          /* ************************************************************************** */

          /* ************************************************************************** */
          /*                                  ABSTRACT                                  */
          /* ************************************************************************** */
          // Fields
          "abstract-field",
          "public-abstract-field",
          "protected-abstract-field",
          "private-abstract-field",

          // Methods
          "abstract-method",
          "public-abstract-method",
          "protected-abstract-method",
          "private-abstract-method",
          /* ************************************************************************** */

          // Index signature
          "signature",

          "public-field",
          "public-instance-field",
          "public-decorated-field",

          "protected-field",
          "protected-instance-field",
          "protected-decorated-field",

          "private-field",
          "private-instance-field",
          "private-decorated-field",

          "field",
          "instance-field",
          "decorated-field",

          // Constructors
          "public-constructor",
          "protected-constructor",
          "private-constructor",
          "constructor",

          // Methods
          "public-method",
          "public-instance-method",
          "public-decorated-method",

          "protected-method",
          "protected-instance-method",
          "protected-decorated-method",

          "private-method",
          "private-instance-method",
          "private-decorated-method",

          "method",
          "instance-method",
          "decorated-method",
        ],
      },
    ],
    "@typescript-eslint/explicit-member-accessibility": [
      "error",
      {
        overrides: {
          constructors: "no-public",
        },
      },
    ],
    "import/prefer-default-export": "off",
    /* ************************************************************************** */

    /* ************************************************************************** */
    /*                                   SPACING                                  */
    /* ************************************************************************** */
    "spaced-comment": [2, "always", { markers: ["/"], exceptions: ["*"] }],
    "padding/spacing": [
      2,
      // Imports
      { blankLine: "always", prev: "import", next: "*" },
      { blankLine: "never", prev: "import", next: "import" },
      // Exports
      { blankLine: "always", prev: "export", next: "*" },
      { blankLine: "always", prev: "*", next: "export" },
      { blankLine: "never", prev: "export", next: "export" },
      // Let
      { blankLine: "always", prev: "*", next: "let" },
      { blankLine: "always", prev: "let", next: "*" },
      { blankLine: "never", prev: "let", next: "let" },
      // Constants
      { blankLine: "always", prev: "*", next: "const" },
      { blankLine: "always", prev: "const", next: "*" },
      {
        blankLine: "never",
        prev: { keyword: "const", inline: true },
        next: { keyword: "const", inline: true },
      },
      { blankLine: "always", prev: "*", next: "export const" },
      { blankLine: "always", prev: "export const", next: "*" },
      // Type
      { blankLine: "always", prev: "*", next: "type" },
      { blankLine: "always", prev: "type", next: "*" },
      { blankLine: "always", prev: "type", next: "type" },
      { blankLine: "always", prev: "export type", next: "*" },
      { blankLine: "always", prev: "*", next: "export type" },
      // Enums
      { blankLine: "always", prev: "*", next: "export const enum" },
      { blankLine: "always", prev: "export const enum", next: "*" },
      // Interface
      { blankLine: "always", prev: "export interface", next: "*" },
      { blankLine: "always", prev: "*", next: "export interface" },
      // Function
      { blankLine: "always", prev: "*", next: "function" },
      { blankLine: "always", prev: "function", next: "*" },
      // If
      { blankLine: "always", prev: "*", next: "if" },
      { blankLine: "always", prev: "if", next: "*" },
      { blankLine: "never", prev: "singleline-if", next: "singleline-if" },
      // For
      { blankLine: "always", prev: "*", next: "for" },
      { blankLine: "always", prev: "for", next: "*" },
      // Switch
      { blankLine: "always", prev: "*", next: "switch" },
      // Returns
      { blankLine: "always", prev: "*", next: "return" },
      { blankLine: "never", prev: "return", next: "case" },
    ],
    /* ************************************************************************** */

    /* ************************************************************************** */
    /*                                  OVERRIDES                                 */
    /* ************************************************************************** */
    /**
     * Because we aren't dumb
     */
    "no-bitwise": 0,
    /**
     * Accessibility modifiers in contructor arguments in typescript
     */
    "no-useless-constructor": 0,
    /**
     * Because AirBnB is sometimes dumb
     */
    "no-restricted-syntax": 0,
    /**
     * `type` imports require this
     */
    "import/no-named-default": 0,
    /**
     * Errors on `ts` extensions
     */
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        ts: "never",
      },
    ],
    /* ************************************************************************** */
  },
  overrides: [
    {
      files: ["**/*.generated.ts"],
      rules: {
        "@typescript-eslint/explicit-module-boundary-types": 0,
        "import/prefer-default-export": 0,
      },
    },
    {
      files: ["**/index.ts"],
      rules: {
        "import/prefer-default-export": 0,
      },
    }
  ],
};
