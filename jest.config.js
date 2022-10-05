// Following the example here:
// https://nextjs.org/docs/testing#setting-up-jest-with-the-rust-compiler
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

const customJestConfig = {
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testEnvironment: "jest-environment-jsdom",
  // Ignore SVG resource queries in Webpack module rules. For context on
  // resource queries:
  // https://webpack.js.org/configuration/module/#ruleresourcequery This is a
  // bit of a hack. next/jest defines a moduleNameMapper that maps SVG files
  // to fileMock.js, and this applies the same mapper to SVG files with
  // resource query parameters.
  moduleNameMapper: {
    "^.*\\.svg\\?\\w+$":
      "<rootDir>/node_modules/next/dist/build/jest/__mocks__/fileMock.js",
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
