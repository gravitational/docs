// Babel config used by Jest tests for React components
// See: https://jestjs.io/docs/tutorial-react
module.exports = {
  presets: [
    "@babel/preset-env",
    ["@babel/preset-react", { runtime: "automatic" }],
  ],
};
