import { suite } from "uvu";
import * as assert from "uvu/assert";

import { VFile, VFileOptions } from "vfile";
import { remark } from "remark";
import mdx from "remark-mdx";
import { remarkLintTeleportDocsLinks } from "../server/lint-teleport-docs-links";

const transformer = (options: VFileOptions) => {
  const file = new VFile(options);

  return remark().use(mdx).use(remarkLinks).processSync(file).toString();
};

const Suite = suite("utils/lint-teleport-docs-links");

const lint = (options: VFileOptions) => {
  const file = new VFile(options);

  return remark().use(mdx).use(remarkLintTeleportDocsLinks).processSync(file);
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

Suite.run();
