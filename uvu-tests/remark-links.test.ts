import { suite } from "uvu";
import * as assert from "uvu/assert";

import { VFile, VFileOptions } from "vfile";
import { remark } from "remark";
import mdx from "remark-mdx";
import { remarkLinks, RemarkLinksOptions } from "../server/remark-links";

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

const lint = (options: VFileOptions) => {
  const file = new VFile(options);

  return remark()
    .use(mdx)
    .use(remarkLinks, {
      lint: true,
    })
    .processSync(file);
};

const getErrors = (result: VFile) => {
  if (result.messages === undefined || result.messages.length == 0) {
    return [];
  }
  return result.messages.map(({ message }) => message);
};

Suite("Prints a lint error for full Teleport URLs: index page", () => {
  const result = lint({
    value: "[Some link](https://goteleport.com/docs/)",
    path: "/docs/enterprize/index.mdx",
  });

  const errors = getErrors(result);

  assert.equal(errors, [
    "Link reference https://goteleport.com/docs/ must be a relative link to an *.mdx page",
  ]);
});

Suite("Prints a lint error for full Teleport URLs: relative", () => {
  const result = lint({
    value: "[Some link](/docs/application-access/guides/myapp)",
    path: "/docs/enterprize/index.mdx",
  });

  const errors = getErrors(result);

  assert.equal(errors, [
    "Link reference /docs/application-access/guides/myapp must be a relative link to an *.mdx page",
  ]);
});

Suite("Prints a lint error for full Teleport URLs: path", () => {
  const result = lint({
    value:
      "[Some link](https://goteleport.com/docs/application-access/guides/myapp)",
    path: "/docs/enterprize/index.mdx",
  });

  const errors = getErrors(result);

  assert.equal(errors, [
    "Link reference https://goteleport.com/docs/application-access/guides/myapp must be a relative link to an *.mdx page",
  ]);
});

Suite("Prints a lint error for full Teleport URLs: fragment", () => {
  const result = lint({
    value: "[Some link](https://goteleport.com/docs/mypage#fragment)",
    path: "/docs/enterprize/index.mdx",
  });

  const errors = getErrors(result);

  assert.equal(errors, [
    "Link reference https://goteleport.com/docs/mypage#fragment must be a relative link to an *.mdx page",
  ]);
});

Suite("Ignores full Teleport URLs in code blocks", () => {
  const result = lint({
    value: `\`\`\`yaml
# Comment with a link: https://goteleport.com/docs
mykey: myval
\`\`\``,
    path: "/docs/enterprize/index.mdx",
  });

  const errors = getErrors(result);

  assert.equal(errors, []);
});

Suite("Prints a lint error for full Teleport URLs: component href", () => {
  const result = lint({
    value: '<Component href="https://goteleport.com/docs" />',
    path: "/docs/enterprize/index.mdx",
  });

  const errors = getErrors(result);

  assert.equal(errors, [
    "Component href https://goteleport.com/docs must be a relative link to an *.mdx page",
  ]);
});

Suite("Ignores absolute docs URL paths if linting is disabled", () => {
  let file = new VFile({
    value: "[Some link](https://goteleport.com/docs/)",
    path: "/docs/enterprize/index.mdx",
  });
  const result = remark()
    .use(mdx)
    .use(remarkLinks, { lint: false })
    .processSync(file);

  const errors = getErrors(result);

  assert.equal(errors, []);
});

Suite.run();
