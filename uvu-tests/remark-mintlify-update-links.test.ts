import { suite } from "uvu";
import * as assert from "uvu/assert";

import { VFile, VFileOptions } from "vfile";
import { remark } from "remark";
import mdx from "remark-mdx";
import remarkMintlifyUpdateLinks, {
  PluginOptions,
} from "../server/remark-mintlify-update-links";

const transformer = (options: VFileOptions, pluginOptions: PluginOptions) => {
  const file = new VFile(options);

  return remark()
    .use(mdx)
    .use(remarkMintlifyUpdateLinks, pluginOptions)
    .processSync(file)
    .toString();
};

const Suite = suite("utils/remark-links");

Suite("Removes .mdx and adds /workflow at the end", () => {
  const result = transformer(
    {
      value: "[Some link](workflow.mdx)",
      path: "/docs/enterprize/index.mdx",
    },
    { slug: "/docs/enterprize/" }
  );

  assert.equal(result, "[Some link](/docs/enterprize/workflow)\n");
});

Suite("Removes .mdx and moves one level higher", () => {
  const result = transformer(
    {
      value: "[Some link](workflow.mdx)",
      path: "/docs/enterprize.mdx",
    },
    { slug: "/docs/enterprize/" }
  );

  assert.equal(result, "[Some link](/docs/workflow)\n");
});

Suite("Removes /index.mdx", () => {
  const result = transformer(
    {
      value: "[Some link](workflow/index.mdx)",
      path: "/docs/enterprize/index.mdx",
    },
    { slug: "/docs/enterprize/" }
  );

  assert.equal(result, "[Some link](/docs/enterprize/workflow)\n");
});

Suite("Correctly resolves parent folder", () => {
  const result = transformer(
    {
      value: "[Some link](../workflow.mdx)",
      path: "/docs/enterprize.mdx",
    },
    { slug: "/docs/enterprize/" }
  );

  assert.equal(result, "[Some link](/workflow)\n");
});

Suite("Correctly resolves root paths", () => {
  const result = transformer(
    {
      value: "[Some link](/workflow.mdx)",
      path: "/docs/enterprize.md",
    },
    { slug: "/docs/enterprize/" }
  );

  assert.equal(result, "[Some link](/workflow)\n");
});

Suite("Correctly resolves links with hashes", () => {
  const result = transformer(
    {
      value: "[Some link](workflow.mdx#anchor)",
      path: "/docs/enterprize.mdx",
    },
    { slug: "/docs/enterprize/" }
  );

  assert.equal(result, "[Some link](/docs/workflow#anchor)\n");
});

Suite("Leave external links as is", () => {
  const result = transformer(
    {
      value: "[Some link](https://yandex.ru/workflow.mdx)",
      path: "/docs/enterprize.mdx",
    },
    { slug: "/docs/enterprize/" }
  );

  assert.equal(result, "[Some link](https://yandex.ru/workflow.mdx)\n");
});

Suite("Work with mdx components", () => {
  const result = transformer(
    {
      value: '<Component href="../workflow.mdx"/>',
      path: "/docs/enterprize/index.mdx",
    },
    { slug: "/docs/enterprize/" }
  );

  assert.equal(result, '<Component href="/docs/workflow" />\n');
});

Suite.run();
