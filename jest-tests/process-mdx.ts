// Based on the example here:
// https://github.com/bitttttten/jest-transformer-mdx/issues/25#issuecomment-1041767325

import "path";
import { compile as compileMDX } from "@mdx-js/mdx";
import { default as nextJest } from "next/dist/build/swc/jest-transformer.js";
import { default as mdxOptions } from "server/mdx-config-docs";

export async function processMDXChunk(chunk: string) {
  console.log("mdxOptions: %o", mdxOptions);
  const jsx = await compileMDX(filepath, {
    ...mdxOptions,
  });

  return transformed;
}

