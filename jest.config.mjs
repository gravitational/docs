// Following the example here:
// https://nextjs.org/docs/testing#setting-up-jest-with-the-rust-compiler
import { default as nextJest } from "next/jest.js";
let mdxDocsOptions = {};

// Generate an async function that Jest will call when loading its config. This
// mimics the function signature of the default export of 'next/jest'. See:
// https://github.com/vercel/next.js/blob/35308c668ee63d8cea5a2c12713d7c761f259764/packages/next/build/jest/jest.ts#L59-L61
export default async function createJestConfig() {
  const mdxConfig = await import("./.build/server/mdx-config-docs.mjs");
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

  const loadConf = await createJestConfig(customJestConfig);
  const loadedConf = await loadConf();

  loadedConf.transformIgnorePatterns = [
    // MDX-JS uses ECMAScript modules, so we need to ensure that we can
    // transform the source. The default next/jest config ignores all
    // contents of node_modules, so we override that config before passing
    // it to Jest.
    //
    // Context: https://mdxjs.com/docs/troubleshooting-mdx/#esm
    "/node_modules/(?!@mdx-js)",
    // Besides '/node_modules/' this is the second default
    // transformIgnorePatterns value.
    "^.+\\.module\\.(css|sass|scss)$",
  ];

  // Get the transformer config the next/jest-generated Jest config uses for
  // JavaScript files so we can pass it to our custom MDX transformer.
  // next/jest generates this from our NextJS config, so we need to generate
  // the config before we can pass it to the transformer.
  for (const value of Object.values(loadedConf.transform)) {
    if (value.length == 2 && value[0].includes("jest-transformer.js")) {
      loadedConf.transform["^.+\\.(md|mdx)$"] = [
        "./jest-tests/mdx-transformer.mjs",
        {
          mdxOptions: mdxConfig,
          nextConfig: value[1].nextConfig,
        },
      ];
      break;
    }
  }

  return loadedConf;
}
