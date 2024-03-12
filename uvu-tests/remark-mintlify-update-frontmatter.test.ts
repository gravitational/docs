import { suite } from "uvu";
import * as assert from "uvu/assert";
import { readFileSync } from "fs";
import { resolve } from "path";
import { VFile, VFileOptions } from "vfile";
import { remark } from "remark";
import mdx from "remark-mdx";
import remarkFrontmatter from "remark-frontmatter";

import remarkMintlifyUpdateFrontmatter, {
  PluginOptions,
} from "../server/remark-mintlify-update-frontmatter";

const transformer = (
  options: VFileOptions,
  pluginOptions: PluginOptions = {}
) => {
  const file = new VFile(options);

  return remark()
    .use(mdx)
    .use(remarkFrontmatter)
    .use(remarkMintlifyUpdateFrontmatter, pluginOptions)
    .processSync(file)
    .toString();
};

const Suite = suite("utils/remark-mintlify-update-frontmatter");

Suite("Adds vesion info correctly", () => {
  const value = readFileSync(
    resolve("server/fixtures/mintlify-frontmatter-source.mdx"),
    "utf-8"
  );

  const actual = transformer({ value }, { version: "10.x" });

  const expected = readFileSync(
    resolve("server/fixtures/mintlify-frontmatter-expected.mdx"),
    "utf-8"
  );

  assert.equal(actual, expected);
});

Suite.run();
