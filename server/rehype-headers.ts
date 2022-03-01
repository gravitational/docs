/*
 * inspired by docusaurus-mdx-loader.
 *
 * Gathers info about headers used on the page to use in the right navigation column,
 * and exports it as "export const tableOfContents = { ... };".
 */

import type { Transformer } from "unified";
import type { Element } from "hast";
import type { Parent } from "unist";

import { visit } from "unist-util-visit";
import { headingRank } from "hast-util-heading-rank";
import { toString } from "hast-util-to-string";
import stringifyObject from "stringify-object";
import { createMdxjsEsmNode } from "./mdx-helpers";

interface HeaderMeta {
  rank: number;
  id: string;
  title: string;
}

interface RehypeHeadersOptions {
  name?: string;
  maxLevel: number;
}

export default function rehypeHeaders({
  name = "tableOfConents",
  maxLevel,
}: RehypeHeadersOptions): Transformer {
  return (root: Parent) => {
    const headers: HeaderMeta[] = [];

    visit(root, "element", (node: Element) => {
      if (headingRank(node) && headingRank(node) <= maxLevel) {
        headers.push({
          rank: headingRank(node),
          id: node.properties?.id as string,
          title: toString(node),
        });
      }
    });

    root.children.unshift(
      createMdxjsEsmNode(`const ${name} = ${stringifyObject(headers)};`)
    );
  };
}
