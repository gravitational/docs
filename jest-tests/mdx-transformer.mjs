// Based on the example here:
// https://github.com/bitttttten/jest-transformer-mdx/issues/25#issuecomment-1041767325

import "path";
import { compile as compileMDX } from "@mdx-js/mdx";
import { default as nextJest } from "next/dist/build/swc/jest-transformer.js";

function process(src, filepath, config) {
  console.log("running process");
  let transformed;
  (async function () {
    console.log("inside the async function");
    try {
      const jsx = await compileMDX(filepath, {
        ...config.transformerConfig.mdxOptions,
      });
    } catch (err) {
      console.error(err);
    }
    console.log("jsx: ", jsx);
    const transformer = nextJest.createTransformer(config.transformerConfig);
    transformed = await transformer.processAsync(
      `import {mdx} from '@mdx-js/react';${jsx}`,
      filepath,
      {
        config: {},
      }
    );

    console.log("transformed code:", transformed);
  })();
  console.log("after the async function");

  return transformed;
}

// Jest expects transformers that use ECMASCript modules to export an object
// called "default" for compatibility with CommonJS. See:
// https://github.com/facebook/jest/blob/dfc87111e708b9294dc54ab0c17712972d042c1c/packages/jest-util/src/requireOrImportModule.ts#L45
export default {
  process: process,
};
