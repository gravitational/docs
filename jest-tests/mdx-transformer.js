// Based on the example here:
// https://github.com/bitttttten/jest-transformer-mdx/issues/25#issuecomment-1041767325

const path = require("path");
const babelJest = require("babel-jest");

// we support either a path to a file, or the options itself
// see: https://github.com/bitttttten/jest-transformer-mdx/pull/20
async function resolveMdxOptions(src) {
  if (typeof src === "string") {
    return await import(path.resolve(process.cwd(), src));
  }
  return src;
}

async function process(src, filepath, config) {
  const mdx = await import("@mdx-js/mdx");
  const options = resolveOptions(config);
  const mdxOptions = resolveMdxOptions(options.mdxOptions);

  const jsx = mdx.sync(withFrontMatter, { ...mdxOptions, filepath });

  return `import {mdx} from '@mdx-js/react';${jsx}`;

  // TODO: Look into transforming the resulting JSX with Babel per the original
  // example.
}

module.exports.process = process;
