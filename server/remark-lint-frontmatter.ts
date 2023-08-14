/*
 * remark-lint plugin to check uniqueness of title and description in frontmatter.
 * Using simple in-memory cache for previous results.
 */

import type { Node as UnistNode, Parent as UnistParent } from "unist";
import type { VFile } from "vfile";

import { lintRule } from "unified-lint-rule";
import find from "unist-util-find";
import yaml from "js-yaml";

interface Frontmatter {
  title?: string;
  description?: string;
}

interface Entry {
  path: string;
  frontmatter: Frontmatter;
}

let cache: Entry[] = [];

const hasMatchingFieldValueInCache = (field: string) => (value: string) => {
  // value may be optional or missing
  if (!value) return null;

  const entry = cache.find(
    ({ frontmatter }) =>
      frontmatter[field] && frontmatter[field].trim() === value.trim()
  );

  return entry ? entry.path : null;
};

const hasMatchingTitle = hasMatchingFieldValueInCache("title");
const hasMatchingDescription = hasMatchingFieldValueInCache("description");

const remarkLintFrontmatter = lintRule(
  "remark-lint:frontmatter",
  (root: UnistParent, file: VFile) => {
    // This is a type of the node created by remark-frontmatter plugin in remark-lint
    const node = find(root, (node: UnistNode) => node.type === "yaml");

    if (!node) return;

    const frontmatter = yaml.load(node.value as string) as Frontmatter;

    const { title, description } = frontmatter;

    const pathWithTitle = hasMatchingTitle(title);

    if (pathWithTitle) {
      file.fail(`Title "${title}" is already used in "${pathWithTitle}"`);
    }

    const pathWithDecription = hasMatchingDescription(description);

    if (pathWithDecription) {
      file.fail(
        `Description "${description}" is already used in "${pathWithDecription}"`
      );
    }

    cache.push({ path: file.path, frontmatter });
  }
);

export default remarkLintFrontmatter;

// Method to reset or set inital cache values, mostly for tests
export const resetCacheValue = (value = []) => {
  cache = value;
};
