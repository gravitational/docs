import "path";
import { compile as compileMDX } from "@mdx-js/mdx";
import { default as nextJest } from "next/dist/build/swc/jest-transformer.js";

async function processAsync(src, filepath, config) {
  let transformed;
  const jsx = await compileMDX(filepath, {
    ...config.transformerConfig.mdxOptions,
  });
  console.log(jsx);
  const transformer = nextJest.createTransformer(config.transformerConfig);
  transformed = transformer.process(
    `import {mdx} from '@mdx-js/react';${jsx}`,
    filepath,
    {
      config: {},
    }
  );

  console.log(transformed);

  return transformed;
}

// Jest expects transformers that use ECMASCript modules to export an object
// called "default" for compatibility with CommonJS. See:
// https://github.com/facebook/jest/blob/dfc87111e708b9294dc54ab0c17712972d042c1c/packages/jest-util/src/requireOrImportModule.ts#L45
export default {
  process: processAsync,
};
