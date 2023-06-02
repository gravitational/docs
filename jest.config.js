module.exports = {
  testPathIgnorePatterns: ["/content/*", "/uvu-tests"],
  modulePaths: ["<rootDir>/src"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^components/(.*)$": "<rootDir>/components/$1",
    "^.+\\.(css|less|scss)$": "babel-jest",
  },
  transform: {
    "^.+\\.(ts|tsx)$": "babel-jest",
  },
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
};
