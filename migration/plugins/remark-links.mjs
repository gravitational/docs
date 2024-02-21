/*
 * This plugin resolves relative links to absolute values and removes [index].mdx part.
 *
 * Docs use relative links to other pages with file extendions an the end.
 * E. g. "../getting-started/index.mdx". Its convenient because we don't need
 * to update links between versions and we can validate them with remark-lint.
 * But such links will not work on the site, because Next needs absolute paths.
 *
 */

import { resolve } from "path";
import { visit } from "unist-util-visit";
import { isExternalLink, isHash, isPage } from "../../.build/utils/url.mjs";

const mdxNodeTypes = new Set(["mdxJsxFlowElement", "mdxJsxTextElement"]);

const isPlainString = (href) => {
  return typeof href === "string";
};

const updateHref = (basename, href) => {
  if (!isPlainString(href)) {
    return href;
  }

  const newHref = href.replace(/\.mdx/, "");

  if (/^\//.test(newHref)) {
    return newHref;
  }

  return resolve(basename, newHref);
};

const isLocalHref = (href) => {
  if (!href) {
    return false;
  }
  if (typeof href !== "string") {
    const url = href.value;
    return !isExternalLink(url) && !isHash(url) && isPage(url);
  }
  return !isExternalLink(href) && !isHash(href) && isPage(href);
};

const isMdxComponentWithLocalHref = (node) => {
  return (
    mdxNodeTypes.has(node.type) &&
    node.attributes.some(
      ({ name, value }) => name === "href" && isLocalHref(value)
    )
  );
};

const isRemarkLinkWilthLocalHref = (node) => {
  return node.type === "link" && isLocalHref(node.url);
};

export default function remarkLinks({ currentUri } = {}) {
  return (root) => {
    visit(root, (node) => {
      if (isRemarkLinkWilthLocalHref(node)) {
        node.url = updateHref(currentUri, node.url);
      } else if (isMdxComponentWithLocalHref(node)) {
        const hrefAttribute = node.attributes.find(
          ({ name }) => name === "href"
        );
        hrefAttribute.value = updateHref(currentUri, hrefAttribute.value);
      }
    });
  };
}
