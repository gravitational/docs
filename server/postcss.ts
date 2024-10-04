import { resolve } from "path";

export function extendedPostcssConfigPlugin() {
  return {
    name: "custom-postcss",
    configurePostCss(options) {
      // Appended pluigns, needed for the header
      options.plugins.push(
        [
          "@csstools/postcss-global-data",
          {
            files: [resolve("./src/styles/media.css")],
          },
        ],
        [
          "postcss-preset-env",
          {
            autoprefixer: {
              flexbox: "no-2009",
            },
            stage: 1,
            features: {
              "custom-properties": false,
              "nesting-rules": true,
            },
          },
        ]
      );

      return options;
    },
  };
}
