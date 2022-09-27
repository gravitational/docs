module.exports = {
  testEnvironment: "jsdom",
  transform: {
    // See babel.config.js for config options for Babel-based code
    // transformation
    "\\.[jt]sx?$": "babel-jest",
  },
};
