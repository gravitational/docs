import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  stories: [
    "../components/**/*.stories.@(js|jsx|ts|tsx)",
    "../layouts/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: ["@storybook/addon-interactions", "@storybook/addon-viewport"],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  webpackFinal: async (config) => {
    config.module?.rules?.push({
      test: /\.css$/,
      use: {
        loader: "postcss-loader",
        options: {
          postcssOptions: {
            plugins: [
              "postcss-flexbugs-fixes",
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
                  importFrom: ["styles/media.css"],
                },
              ],
            ],
          },
        },
      },
    });

    const imageRule = config.module?.rules?.find((rule) => {
      const test = (rule as { test: RegExp }).test;

      if (!test) {
        return false;
      }

      return test.test(".svg");
    }) as { [key: string]: any };

    imageRule.exclude = /\.svg$/;

    config.module?.rules?.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};
export default config;
