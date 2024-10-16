import { suite } from "uvu";
import * as assert from "uvu/assert";

import { VFile, VFileOptions } from "vfile";
import { remark } from "remark";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import mdx from "remark-mdx";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeMdxToHast from "../server/rehype-mdx-to-hast";

const transformer = (options: VFileOptions) =>
  remark()
    .use(mdx)
    .use(remarkRehype, {
      passThrough: [
        "mdxFlowExpression",
        "mdxJsxFlowElement",
        "mdxJsxTextElement",
        "mdxTextExpression",
        "mdxjsEsm",
      ], // passThrough options says transformer which nodes to leave as is
    })
    .use(rehypeMdxToHast)
    .use(rehypeStringify)
    .processSync(new VFile(options));

const Suite = suite("server/rehype-mdx-to-hast");

Suite("Fixture match result on resolve", () => {
  const value = readFileSync(
    resolve("server/fixtures/mdx-to-hast-source.mdx"),
    "utf-8"
  );

  const result = transformer({ value }).toString();

  const expected = readFileSync(
    resolve("server/fixtures/mdx-to-hast-result.html"),
    "utf-8"
  );

  assert.equal(result, expected);
});

Suite.run();
