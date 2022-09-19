import type { VFile } from "vfile";

import { suite } from "uvu";
import * as assert from "uvu/assert";

import { readSync } from "to-vfile";
import { resolve } from "path";
import { remark } from "remark";
import remarkFrontmatter from "remark-frontmatter";
import remarkLintFrontmatter from "../server/remark-lint-frontmatter";

const transformer = (path: string) => {
  const file = readSync(resolve(path));

  return remark()
    .use(remarkFrontmatter)
    .use(remarkLintFrontmatter)
    .processSync(file);
};

const getErrors = (result: VFile) =>
  result.messages.map(({ message }) => message);

const base = transformer("server/fixtures/lint-frontmatter/base.md"); // Will add baseline to cache

const Suite = suite("server/remark-lint-frontmatter");

Suite("Detects error in title", () => {
  const result = transformer("server/fixtures/lint-frontmatter/base-title.md");

  const expectedErrors = [`Title "Title 1" is already used in "${base.path}"`];

  assert.equal(getErrors(result), expectedErrors);
});

Suite("Detects error in description", () => {
  const result = transformer("server/fixtures/lint-frontmatter/base-desc.md");

  const expectedErrors = [
    `Description "Description 1" is already used in "${base.path}"`,
  ];

  assert.equal(getErrors(result), expectedErrors);
});

Suite("Does not fire if no matches", () => {
  const result = transformer("server/fixtures/lint-frontmatter/new.md");

  assert.equal(getErrors(result), []);
});

Suite.run();
