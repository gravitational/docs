import { suite } from "uvu";
import * as assert from "uvu/assert";

import { resolve } from "path";
import { VFile, VFileOptions } from "vfile";
import { remark } from "remark";
import remarkMdx from "remark-mdx";

import remarkMintlifyImages from "../server/remark-mintlify-update-images";

const staticPath = "/images/";
const destinationDir = resolve(`server/fixtures/images`);

const transformer = (options: VFileOptions) =>
  remark()
    .use(remarkMdx)
    .use(remarkMintlifyImages, { staticPath, destinationDir })
    .processSync(new VFile(options))
    .toString();

const Suite = suite("server/remark-mintlify-update-images");

Suite("Add actual sizes to image without suffix", () => {
  const actual = transformer({
    value: "![Alt text](/images/image.png)",
    path: "/docs/index.mdx",
  });

  const expected =
    '<img src="/images/image.png" alt="Alt text" width="300" height="300" />\n';

  assert.equal(actual, expected);
});

Suite("Moves title correctly", () => {
  const actual = transformer({
    value: '![Alt text](/images/image.png "Title")',
    path: "/docs/index.mdx",
  });

  const expected =
    '<img src="/images/image.png" title="Title" alt="Alt text" width="300" height="300" />\n';

  assert.equal(actual, expected);
});

Suite("Reduces sizes by 1/3 if path ends with @1.5x", () => {
  const actual = transformer({
    value: "![Alt text](/images/image@1.5x.png)",
    path: "/docs/index.mdx",
  });

  const expected =
    '<img src="/images/image@1.5x.png" alt="Alt text" width="200" height="200" />\n';

  assert.equal(actual, expected);
});

Suite("Reduces sizes by 1/2 if path ends with @2x", () => {
  const actual = transformer({
    value: "![Alt text](/images/image@2x.png)",
    path: "/docs/index.mdx",
  });

  const expected =
    '<img src="/images/image@2x.png" alt="Alt text" width="150" height="150" />\n';

  assert.equal(actual, expected);
});

Suite("Reduces sizes by 2/3 if path ends with @3x", () => {
  const actual = transformer({
    value: "![Alt text](/images/image@3x.png)",
    path: "/docs/index.mdx",
  });

  const expected =
    '<img src="/images/image@3x.png" alt="Alt text" width="100" height="100" />\n';

  assert.equal(actual, expected);
});

Suite.run();
