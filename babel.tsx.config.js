// Babel config used by Jest tests for React components
// See: https://jestjs.io/docs/tutorial-react
module.exports = {
  plugins: [
    [
      "babel-plugin-postcss",
      {
        postcss: true,
      },
    ],
  ],
  presets: ["next/babel"],
};
