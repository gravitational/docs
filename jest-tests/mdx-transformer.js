// Based on the example here:
// https://github.com/bitttttten/jest-transformer-mdx/issues/25#issuecomment-1041767325

const path = require("path");
const babelJest = require("babel-jest");

// resolveMdxOptions either imports config file named in src or, if the config
// is an object, return it unchanged.
async function resolveMdxOptions(src) {
  switch (typeof src) {
    case "string":
      return await import(path.resolve(process.cwd(), src));
    case "object":
      return src;
    default:
      throw new Error("unexpected MDX config type: ", typeof src);
  }
}

async function process(src, filepath, config) {
  const mdx = await import("@mdx-js/mdx");
  if (typeof config === "object" && config.hasOwnProperty("mdxOptions")) {
    const mdxOptions = resolveMdxOptions(options.mdxOptions);
  }

  const jsx = mdx.sync(withFrontMatter, { ...mdxOptions, filepath });

  return babelJest.process(
    `import {mdx} from '@mdx-js/react';${jsx}`,
    filepath,
    config
  ).code;
}

module.exports.process = process;
