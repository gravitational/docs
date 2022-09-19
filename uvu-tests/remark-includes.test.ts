import { suite } from "uvu";
import * as assert from "uvu/assert";

import { VFile, VFileOptions } from "vfile";
import { readFileSync } from "fs";
import { resolve } from "path";
import { remark } from "remark";
import remarkMdx from "remark-mdx";
import remarkGFM from "remark-gfm";
import remarkIncludes, {
  RemarkIncludesOptions,
} from "../server/remark-includes";

const transformer = (
  vfileOptions: VFileOptions,
  pluginOptions: RemarkIncludesOptions = { resolve: true }
) => {
  const file = new VFile(vfileOptions);

  return remark()
    .use(remarkMdx)
    .use(remarkGFM)
    .use(remarkIncludes, {
      rootDir: "server/fixtures/includes/",
      ...pluginOptions,
    })
    .processSync(file);
};

const Suite = suite("server/remark-includes");

Suite("Fixture match result on resolve", () => {
  const value = readFileSync(
    resolve("server/fixtures/includes-source.mdx"),
    "utf-8"
  );

  const result = transformer({
    value,
    path: "/content/4.0/docs/pages/filename.mdx",
  }).toString();

  const expected = readFileSync(
    resolve("server/fixtures/includes-result.mdx"),
    "utf-8"
  );

  assert.equal(result, expected);
});

Suite("Returns correct warnings on lint", () => {
  const value = readFileSync(
    resolve("server/fixtures/includes-source.mdx"),
    "utf-8"
  );

  const result = transformer(
    {
      value,
      path: "/content/4.0/docs/pages/filename.mdx",
    },
    { lint: true, resolve: false }
  );

  const errors = result.messages.map(({ message }) => message);

  const expectedErrors = [
    "Includes only works if they are the only content on the line",
    "Wrong import path non-existing.mdx in file /content/4.0/docs/pages/filename.mdx.",
  ];

  assert.equal(errors, expectedErrors);
});

Suite("Leave includes in place on { resolve: false }", () => {
  const value = readFileSync(
    resolve("server/fixtures/includes-source.mdx"),
    "utf-8"
  );

  const result = transformer(
    {
      value,
      path: "/content/4.0/docs/pages/filename.mdx",
    },
    { lint: false, resolve: false }
  ).toString();

  assert.equal(value, result);
});

Suite("Multiple includes resolve in code block", () => {
  const value = readFileSync(
    resolve("server/fixtures/includes-multiple-source.mdx"),
    "utf-8"
  );

  const result = transformer({
    value,
    path: "/content/4.0/docs/pages/filename.mdx",
  }).toString();

  const expected = readFileSync(
    resolve("server/fixtures/includes-multiple-result.mdx"),
    "utf-8"
  );

  assert.equal(result, expected);
});

Suite.run();
