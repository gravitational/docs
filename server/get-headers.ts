/*
 * Gathers info about headers used on the md-page to use in the right navigation column.
 */

import type { Element } from "hast";
import type { Node } from "unist";

import { visit } from "unist-util-visit";
import { headingRank } from "hast-util-heading-rank";
import { toString } from "hast-util-to-string";

interface HeaderMeta {
  rank: number;
  id: string;
  title: string;
}

export default function getHeaders(root: Node, tocDepth: number) {
  const headers: HeaderMeta[] = [];

  visit(root, "element", (node: Element) => {
    if (headingRank(node) && headingRank(node) <= tocDepth) {
      headers.push({
        rank: headingRank(node),
        id: node.properties?.id as string,
        title: toString(node),
      });
    }
  });

  return headers;
}
