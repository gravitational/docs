import { suite } from "uvu";
import * as assert from "uvu/assert";

import { VFile, VFileOptions } from "vfile";
import { remark } from "remark";
import mdx from "remark-mdx";
import remarkLinks from "../server/remark-links";

const transformer = (options: VFileOptions) => {
  const file = new VFile(options);

  return remark().use(mdx).use(remarkLinks).processSync(file).toString();
};

const Suite = suite("utils/remark-links");

Suite("Removes .md and and adds './'", () => {
  const result = transformer({
    value: "[Some link](workflow.mdx)",
    path: "/docs/enterprize/index.mdx",
  });

  assert.equal(result, "[Some link](./workflow/)\n");
});

Suite("Removes .md and and adds '../'", () => {
  const result = transformer({
    value: "[Some link](workflow.md)",
    path: "/docs/enterprize.md",
  });

  assert.equal(result, "[Some link](../workflow/)\n");
});

Suite("Replaces index.md with the '/'", () => {
  const result = transformer({
    value: "[Some link](workflow/index.md)",
    path: "/docs/enterprize/index.md",
  });

  assert.equal(result, "[Some link](./workflow/)\n");
});

Suite("Correctly resolves parent folder", () => {
  const result = transformer({
    value: "[Some link](../workflow.md)",
    path: "/docs/enterprize.md",
  });

  assert.equal(result, "[Some link](../../workflow/)\n");
});

Suite("Correctly resolves root paths", () => {
  const result = transformer({
    value: "[Some link](/workflow.md)",
    path: "/docs/enterprize.md",
  });

  assert.equal(result, "[Some link](/workflow/)\n");
});

Suite("Correctly resolves links with hashes", () => {
  const result = transformer({
    value: "[Some link](workflow.mdx#anchor)",
    path: "/docs/enterprize.md",
  });

  assert.equal(result, "[Some link](../workflow/#anchor)\n");
});

Suite("Correctly resolves non .md paths", () => {
  const result = transformer({
    value: "[Some link](../image.png)",
    path: "/docs/index.md",
  });

  assert.equal(result, "[Some link](../image.png)\n");
});

Suite("Leave external links as is", () => {
  const result = transformer({
    value: "[Some link](https://yandex.ru/workflow.md)",
    path: "/docs/enterprize.md",
  });

  assert.equal(result, "[Some link](https://yandex.ru/workflow.md)\n");
});

Suite("Work with mdx components", () => {
  const result = transformer({
    value: '<Component href="../workflow.mdx"/>',
    path: "/docs/enterprize/index.mdx",
  });

  assert.equal(result, '<Component href="../workflow/" />\n');
});

Suite.run();
