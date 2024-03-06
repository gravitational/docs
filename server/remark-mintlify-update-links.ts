/*
 * This plugin resolves relative links to absolute values and removes [index].mdx part.
 */

import type { Transformer } from "unified";
import type { Node } from "unist";
import type { Link as MdastLink } from "mdast";
import type { MdxJsxElement } from "./types-unist";

import { dirname, resolve } from "path";
import { visit } from "unist-util-visit";
import { isExternalLink, isHash, isPage } from "../utils/url";
import { isMdxNode, getAttribute } from "./mdx-helpers";

// Transfoms page.mdx -> page, page/index.mdx -> page
const updateHref = (basename: string, href: string) => {
  // If component uses something complex for href, leave it as is
  if (typeof href !== "string") return href;

  const newHref = href.replace(/(\/index)?\.mdx/, "");

  // Don't resolve relative paths for URLs starting with / (but still remove mdx extension)
  if (/^\//.test(newHref)) {
    return newHref;
  }

  return resolve(basename, newHref);
};

// Is a link to another local page or file
const isLocalHref = (href: string) =>
  Boolean(href) && !isExternalLink(href) && !isHash(href) && isPage(href);

// Is a <Component /> with href prop and local href
const isMdxComponentWithLocalHref = (node: Node): node is MdxJsxElement => {
  return (
    isMdxNode(node) &&
    node.attributes.some(
      ({ name, value }) => name === "href" && isLocalHref(value as string)
    )
  );
};

// Is a [title](link) with local href
const isRemarkLinkWithLocalHref = (node: Node): node is MdastLink => {
  return node.type === "link" && isLocalHref((node as MdastLink).url);
};

export type PluginOptions = {
  slug: string;
};

export default function remarkMintlifyUpdateLinks({
  slug,
}: PluginOptions): Transformer {
  return (root, vfile) => {
    const isIndex = vfile.basename === "index.mdx";

    visit(root, (node) => {
      if (isRemarkLinkWithLocalHref(node)) {
        node.url = updateHref(isIndex ? slug : dirname(slug), node.url);
      } else if (isMdxComponentWithLocalHref(node)) {
        const hrefAttribute = getAttribute(node, "href");

        hrefAttribute.value = updateHref(slug, hrefAttribute.value as string);
      }
    });
  };
}
