import { suite } from "uvu";
import * as assert from "uvu/assert";

import { VFile, VFileOptions } from "vfile";
import { readFileSync } from "fs";
import { resolve } from "path";
import { remark } from "remark";
import remarkMdx from "remark-mdx";
import { remarkLintSEO } from "../server/remark-lint-seo";
import remarkFrontmatter from "remark-frontmatter";

const transformer = (vfileOptions: VFileOptions): VFile => {
  const file = new VFile(vfileOptions);

  return remark()
    .use(remarkMdx)
    .use(remarkFrontmatter)
    .use(remarkLintSEO)
    .processSync(file);
};

const getErrors = (result: VFile) => {
  if (result.messages === undefined || result.messages.length == 0) {
    return [];
  }
  return result.messages.map(({ message }) => message);
};

const Suite = suite("server/remark-messaging");

Suite("Extraneous H1", () => {
  const value = `---
title: "Getting Started"
description: "In this guide, we will show you how to get started with Teleport, which gives you secure access to databases, Kubernetes clusters, apps, servers, and more."
---

# How to get started

This is a paragraph
`;
  const result = transformer({
    value,
    path: "/content/4.0/docs/pages/filename.mdx",
  });

  const expectedErrors = [
    "Pages must only include a single H1. The docs engine defines this " +
      'using the "h1" frontmatter key and, if that is missing, the ' +
      '"title" frontmatter key.',
  ];

  assert.equal(getErrors(result), expectedErrors);
});

Suite("Description too short", () => {
  const value = `---
title: "Getting Started"
description: "How to get started"
---

This is a paragraph
`;
  const result = transformer({
    value,
    path: "/content/4.0/docs/pages/filename.mdx",
  });

  const expectedErrors = [
    'The page\'s meta description ("description" frontmatter key) must have a length of at least 100 characters for SEO. Add 82 characters to the description.',
  ];

  assert.equal(getErrors(result), expectedErrors);
});

Suite("Description too long", () => {
  const value = `---
title: "Getting Started"
description: "In this guide, we will show you how to get started with Teleport, which gives you secure access to databases, Kubernetes clusters, applications, servers, and more."
---

This is a paragraph
`;
  const result = transformer({
    value,
    path: "/content/4.0/docs/pages/filename.mdx",
  });

  const expectedErrors = [
    'The page\'s meta description ("description" frontmatter key) must have a length of at most 160 characters for SEO. Remove 3 characters from the description.',
  ];

  assert.equal(getErrors(result), expectedErrors);
});

Suite.run();
