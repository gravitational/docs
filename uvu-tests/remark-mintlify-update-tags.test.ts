import { suite } from "uvu";
import * as assert from "uvu/assert";
import { readFileSync } from "fs";
import { resolve } from "path";
import { VFile, VFileOptions } from "vfile";
import { remark } from "remark";
import remarkMdx from "remark-mdx";

import remarkMintlifyUpdateTags from "../server/remark-mintlify-update-tags";

const transformer = (options: VFileOptions) => {
  const file = new VFile(options);

  return remark()
    .use(remarkMdx)
    .use(remarkMintlifyUpdateTags)
    .processSync(file)
    .toString();
};

const Suite = suite("utils/remark-mintlify-update-tags");

Suite("Updates TabItem correctly", () => {
  const value = readFileSync(
    resolve("server/fixtures/mintlify-tags/tabs-source.mdx"),
    "utf-8"
  );

  const actual = transformer({ value });

  const expected = readFileSync(
    resolve("server/fixtures/mintlify-tags/tabs-result.mdx"),
    "utf-8"
  );

  assert.equal(actual, expected);
});

Suite("Updates Details correctly", () => {
  const value = readFileSync(
    resolve("server/fixtures/mintlify-tags/details-source.mdx"),
    "utf-8"
  );

  const actual = transformer({ value });

  const expected = readFileSync(
    resolve("server/fixtures/mintlify-tags/details-result.mdx"),
    "utf-8"
  );

  assert.equal(actual, expected);
});

Suite("Updates Notes correctly", () => {
  const value = readFileSync(
    resolve("server/fixtures/mintlify-tags/note-source.mdx"),
    "utf-8"
  );

  const actual = transformer({ value });

  const expected = readFileSync(
    resolve("server/fixtures/mintlify-tags/note-result.mdx"),
    "utf-8"
  );

  assert.equal(actual, expected);
});

Suite("Unwrap nodes correctly", () => {
  const value = readFileSync(
    resolve("server/fixtures/mintlify-tags/unwrap-source.mdx"),
    "utf-8"
  );

  const actual = transformer({ value });

  const expected = readFileSync(
    resolve("server/fixtures/mintlify-tags/unwrap-result.mdx"),
    "utf-8"
  );

  assert.equal(actual, expected);
});

Suite("Remove nodes correctly", () => {
  const value = readFileSync(
    resolve("server/fixtures/mintlify-tags/remove-source.mdx"),
    "utf-8"
  );

  const actual = transformer({ value });

  const expected = readFileSync(
    resolve("server/fixtures/mintlify-tags/remove-result.mdx"),
    "utf-8"
  );

  assert.equal(actual, expected);
});

Suite("Vars replaced correctly", () => {
  const value = readFileSync(
    resolve("server/fixtures/mintlify-tags/var-source.mdx"),
    "utf-8"
  );

  const actual = transformer({ value });

  const expected = readFileSync(
    resolve("server/fixtures/mintlify-tags/var-result.mdx"),
    "utf-8"
  );

  assert.equal(actual, expected);
});

Suite("Code type replaced correctly", () => {
  const value = readFileSync(
    resolve("server/fixtures/mintlify-tags/code-source.mdx"),
    "utf-8"
  );

  const actual = transformer({ value });

  const expected = readFileSync(
    resolve("server/fixtures/mintlify-tags/code-result.mdx"),
    "utf-8"
  );

  assert.equal(actual, expected);
});

Suite("style attr removed correctly", () => {
  const value = readFileSync(
    resolve("server/fixtures/mintlify-tags/style-source.mdx"),
    "utf-8"
  );

  const actual = transformer({ value });

  const expected = readFileSync(
    resolve("server/fixtures/mintlify-tags/style-result,mdx"),
    "utf-8"
  );

  assert.equal(actual, expected);
});

Suite.run();
