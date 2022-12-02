// Based on the example here:
// https://github.com/bitttttten/jest-transformer-mdx/issues/25#issuecomment-1041767325

import "path";
import { compileSync as compileMDXSync } from "@mdx-js/mdx";
import { default as nextJest } from "next/dist/build/swc/jest-transformer.js";

function process(src, filepath, config) {
  const jsx = compileMDXSync(filepath, {
    ...config.transformerConfig.mdxOptions,
  });
  const transformed = nextJest
    .createTransformer(config.transformerConfig)
    .process(`import {mdx} from '@mdx-js/react';${jsx}`, filepath, {
      config: {},
    });

  console.log("transformed code:", transformed);

  return transformed;
}

// Jest expects transformers that use ECMASCript modules to export an object
// called "default" for compatibility with CommonJS. See:
// https://github.com/facebook/jest/blob/dfc87111e708b9294dc54ab0c17712972d042c1c/packages/jest-util/src/requireOrImportModule.ts#L45
export default {
    process: process
}
