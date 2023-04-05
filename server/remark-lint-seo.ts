import { lintRule } from "unified-lint-rule";
import { visit } from "unist-util-visit";
import type { VFile } from "vfile";
import type { Position, Node, Parent } from "unist";
import type { Code, Literal, Heading } from "mdast";
import find from "unist-util-find";
import yaml from "js-yaml";

const maxLength = 160;
const minLength = 70;

function isHeading(node: Node) {
  return node.type === "heading";
}

interface Frontmatter {
  title?: string;
  description?: string;
}

export const remarkLintSEO = lintRule(
  "remark-lint:messaging",
  (root: Parent, file: VFile) => {
    // This is a type of the node created by remark-frontmatter plugin in
    // remark-lint
    const node = find(root, (node: Node) => node.type === "yaml");

    // If there's no frontmatter, we'll let other linting steps take care of
    // it.
    if (node !== undefined) {
      const frontmatter = yaml.load(node.value as string) as Frontmatter;
      const { title, description } = frontmatter;

      if (description.length < minLength) {
        file.message(
          `The page's meta description ("description" frontmatter key) must have ` +
            `a length of at least ${minLength} characters for SEO. ` +
            `Add ${
              minLength - description.length
            } characters to the description.`,
          node.position
        );
      }

      if (description.length > maxLength) {
        file.message(
          `The page's meta description ("description" frontmatter key) must have ` +
            `a length of at most ${maxLength} characters for SEO. ` +
            `Remove ${
              description.length - maxLength
            } characters from the description.`,
          node.position
        );
      }
    }

    visit(root, isHeading, (node: Heading, index: number, parent: Parent) => {
      if (node.depth == 1) {
        file.message(
          "Pages must only include a single H1. The docs engine defines this " +
            'using the "h1" frontmatter key and, if that is missing, the ' +
            '"title" frontmatter key.',
          node.position
        );
      }
    });
  }
);
