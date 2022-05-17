import type { Node as UnistNode, Parent as UnistParent } from "unist";
import type { VFile } from "vfile";

import { lintRule } from "unified-lint-rule";
import find from "unist-util-find";
import yaml from "js-yaml";

interface Meta {
  title?: string;
  description?: string;
}

let cache: Record<string, Meta> = {};

const hasMatchingFieldValue = (field: string) => (value: string) => {
  if (!value) {
    return null;
  }

  const entry = Object.entries(cache).find(
    ([_, meta]) => meta[field] && meta[field].trim() === value.trim()
  );

  return entry ? entry[0] : null;
};

const hasMatchingTitle = hasMatchingFieldValue("title");
const hasMatchingDescription = hasMatchingFieldValue("description");

const remarkLintFrontmatter = lintRule(
  "remark-lint:frontmatter",
  (root: UnistParent, file: VFile) => {
    const node = find(root, (node: UnistNode) => node.type === "yaml");

    if (!node) {
      return;
    }

    const meta = yaml.load(node.value as string) as Meta;

    const { title, description } = meta;

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

    cache[file.path] = meta;
  }
);

export default remarkLintFrontmatter;

export const cleanCache = () => {
  cache = {};
};
