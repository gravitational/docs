/*
 * This plugin resolves relative links to absolute values and removes [index].mdx part.
 *
 * Docs use relative links to other pages iwth file extendions an the end.
 * E. g. "../getting-started/index.mdx". Its convenient because we don't need
 * to update links between versions and we can validate them with remark-lint.
 * But such links will not work on the site, because Next needs absolute paths.
 *
 * We do this transformation on server, because we can't distinguish between
 * "page/idex.mdx" and "page.mdx" on the client and cant update paths accordingly.
 */

import type { Transformer } from "unified";
import type { Link as MdastLink } from "mdast";
import type { EsmNode, MdxAnyElement, MdxastNode } from "./types-unist";

import { visit } from "unist-util-visit";
import { isExternalLink, isHash, isPage } from "../utils/url";

interface ObjectHref {
  src: string;
}

type Href = string | ObjectHref;

const mdxNodeTypes = new Set(["mdxJsxFlowElement", "mdxJsxTextElement"]);

function isPlainString(href): href is string {
  return typeof href === "string";
}

const updateHref = (basename: string, href: Href) => {
  if (!isPlainString(href)) {
    return href;
  }
  const isIndex = basename.match(/^index.mdx?$/);
  const prefix = isIndex ? "./" : "../";
  const newHref = href.replace(/(\/)?(index)?\.mdx?\/?/, "/");
  const startsWithDot = /^\./.test(newHref);
  const startsWithSlash = /^\//.test(newHref);

  return (startsWithDot && isIndex) || startsWithSlash
    ? newHref
    : prefix + newHref;
};

const isLocalHref = (href?: string | EsmNode) => {
  if (!href) {
    return false;
  }

  if (typeof href !== "string") {
    const url = href.value;
    return !isExternalLink(url) && !isHash(url) && isPage(url);
  }

  return !isExternalLink(href) && !isHash(href) && isPage(href);
};

const isMdxComponentWithLocalHref = (
  node: MdxastNode
): node is MdxAnyElement => {
  return (
    mdxNodeTypes.has(node.type) &&
    (node as MdxAnyElement).attributes.some(
      ({ name, value }) =>
        name === "href" && isLocalHref(value as string | EsmNode)
    )
  );
};

const isRemarkLinkWilthLocalHref = (node: MdxastNode): node is MdastLink => {
  return node.type === "link" && isLocalHref(node.url);
};

export default function remarkLinks(): Transformer {
  return (root, vfile) => {
    const basename = vfile?.basename || "";

    visit(root, (node: MdxastNode) => {
      if (isRemarkLinkWilthLocalHref(node)) {
        node.url = updateHref(basename, node.url) as string;
      } else if (isMdxComponentWithLocalHref(node)) {
        const hrefAttribute = node.attributes.find(
          ({ name }) => name === "href"
        );
        hrefAttribute.value = updateHref(
          basename,
          hrefAttribute.value as Href
        ) as string;
      }
    });
  };
}
