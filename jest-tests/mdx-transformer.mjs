// Based on the example here:
// https://github.com/bitttttten/jest-transformer-mdx/issues/25#issuecomment-1041767325

import "path";
import { default as babelJest } from "babel-jest";
import "@mdx-js/mdx"

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

export async function processAsync(src, filepath, config) {
  if (typeof config === "object" && config.hasOwnProperty("mdxOptions")) {
    const mdxOptions = resolveMdxOptions(options.mdxOptions);
  }

  const jsx = mdx.sync(withFrontMatter, { ...mdxOptions, filepath });

  return babelJest
    .createTransformer({})
    .process(`import {mdx} from '@mdx-js/react';${jsx}`, filepath, config);
}
