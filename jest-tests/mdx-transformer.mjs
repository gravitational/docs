// Based on the example here:
// https://github.com/bitttttten/jest-transformer-mdx/issues/25#issuecomment-1041767325

import "path";
import { default as babelJest } from "babel-jest";
import { compileSync } from "@mdx-js/mdx";

// resolveMdxOptions either imports config file named in src or, if the config
// is an object, return it unchanged.
async function resolveMdxOptions(src) {
  switch (typeof src) {
    case "string":
      return await import(path.resolve(process.cwd(), src));
    case "object":
      return src;
    case "undefined":
      // We haven't passed any options, so use the defaults
      return {};
    default:
      throw new Error("unexpected MDX config type: ", typeof src);
  }
}

function process(src, filepath, config) {
  const mdxOptions = resolveMdxOptions(config.mdxOptions);

  const jsx = compileSync(filepath, { ...mdxOptions });

  return babelJest
    .createTransformer({})
    .process(`import {mdx} from '@mdx-js/react';${jsx}`, filepath, config);
}

export default {
  process: process,
};
