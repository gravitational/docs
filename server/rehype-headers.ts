/*
 * inspired by docusaurus-mdx-loader.
 *
 * Gathers info about headers used on the page to use in the right navigation column,
 * and writes the to the vfile.data.toc, which we can read after we finish processing files.
 */

import type { VFile } from "vfile";
import type { Transformer } from "unified";
import type { Element } from "hast";
import type { Parent } from "unist";

import { visit } from "unist-util-visit";
import { headingRank } from "hast-util-heading-rank";
import { toString } from "hast-util-to-string";

interface HeaderMeta {
  rank: number;
  id: string;
  title: string;
}

interface RehypeHeadersOptions {
  maxLevel: number;
}

export default function rehypeHeaders({
  maxLevel,
}: RehypeHeadersOptions): Transformer {
  return (root: Parent, vfile: VFile) => {
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

    vfile.data.toc = headers;
  };
}
