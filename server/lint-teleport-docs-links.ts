import { lintRule } from "unified-lint-rule";
import { visit } from "unist-util-visit";
import type { Link as MdastLink } from "mdast";
import type { EsmNode, MdxAnyElement, MdxastNode } from "./types-unist";

import { isExternalLink, isHash, isPage } from "../utils/url";

interface ObjectHref {
  src: string;
}

type Href = string | ObjectHref;

const mdxNodeTypes = new Set(["mdxJsxFlowElement", "mdxJsxTextElement"]);

const isMdxComponentWithHref = (node: MdxastNode): node is MdxAnyElement => {
  return (
    mdxNodeTypes.has(node.type) &&
    (node as MdxAnyElement).attributes.some(
      ({ name, value }) => name === "href"
    )
  );
};

const isAnAbsoluteDocsLink = (href: string): boolean => {
  return (
    href.startsWith("/docs") || href.startsWith("https://goteleport.com/docs")
  );
};

export const remarkLintTeleportDocsLinks = lintRule(
  "remark-lint:absolute-docs-links",
  (root, vfile) => {
    visit(root, undefined, (node: MdxastNode) => {
      if (node.type == "link" && isAnAbsoluteDocsLink(node.url)) {
        vfile.message(
          `Link reference ${node.url} must be a relative link to an *.mdx page`,
          node.position
        );
        return;
      }

      if (isMdxComponentWithHref(node)) {
        const hrefAttribute = node.attributes.find(
          ({ name }) => name === "href"
        );

        if (isAnAbsoluteDocsLink(hrefAttribute.value as string)) {
          vfile.message(
            `Component href ${hrefAttribute.value} must be a relative link to an *.mdx page`,
            node.position
          );
        }
      }
    });
  }
);
