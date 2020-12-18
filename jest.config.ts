export default {
  globals: {
    "ts-jest": {
      compiler: "ttypescript",
    },
  },
  testEnvironment: "node",
  transform: { "^.+\\.tsx?$": "ts-jest" },
  collectCoverage: false,
  collectCoverageFrom: ["src/**/*.{js,ts}"],
  coverageReporters: ["text-summary", "lcov"],
};
