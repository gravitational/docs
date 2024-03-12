import { suite } from "uvu";
import * as assert from "uvu/assert";

import { resolve } from "path";
import { VFile, VFileOptions } from "vfile";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import html from "rehype-stringify";

import rehypeImages from "../server/rehype-images";

const staticPath = "/images/";
const destinationDir = resolve(`server/fixtures/images`);

const transformer = (options: VFileOptions) =>
  unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeImages, { staticPath, destinationDir })
    .use(html)
    .processSync(new VFile(options))
    .toString();

const Suite = suite("server/rehype-images");

Suite("Add actual sizes to image without suffix", () => {
  const result = transformer({
    value: "![Alt text](/images/image.png)",
    path: "/docs/index.mdx",
  });

  assert.equal(
    result,
    '<img src="/images/image.png" alt="Alt text" width="300" height="300">'
  );
});

Suite("Reduces sizes by 1/3 if path ends with @1.5x", () => {
  const result = transformer({
    value: "![Alt text](/images/image@1.5x.png)",
    path: "/docs/index.mdx",
  });

  assert.equal(
    result,
    '<img src="/images/image@1.5x.png" alt="Alt text" width="200" height="200">'
  );
});

Suite("Reduces sizes by 1/2 if path ends with @2x", () => {
  const result = transformer({
    value: "![Alt text](/images/image@2x.png)",
    path: "/docs/index.mdx",
  });

  assert.equal(
    result,
    '<img src="/images/image@2x.png" alt="Alt text" width="150" height="150">'
  );
});

Suite("Reduces sizes by 2/3 if path ends with @3x", () => {
  const result = transformer({
    value: "![Alt text](/images/image@3x.png)",
    path: "/docs/index.mdx",
  });

  assert.equal(
    result,
    '<img src="/images/image@3x.png" alt="Alt text" width="100" height="100">'
  );
});

Suite.run();
