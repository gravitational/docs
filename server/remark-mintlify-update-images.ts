/*
 * This plugin will do two things:
 * - Convert image nodex to mdx <img /> components.
 * - Add width and height for each image it can parse.
 */

import type { Transformer } from "unified";
import type { Node, Parent } from "unist";
import type { Image as MdastImage } from "mdast";
import type { MdxJsxFlowElement, MdxJsxTextElement } from "./types-unist";

import { existsSync } from "fs";
import sizeOf from "image-size";
import { visit } from "unist-util-visit";

import { isExternalLink, isHash } from "../utils/url";
import { getScaleRatio } from "./image-helpers";
import { isMdxNode } from "./mdx-helpers";

const isMdxImg = (
  node: Node
): node is MdxJsxFlowElement | MdxJsxTextElement => {
  if (isMdxNode(node) && node.name === "img") {
    const src = node.attributes.find(({ name }) => name === "src")?.value;

    return typeof src === "string" && !isExternalLink(src) && !isHash(src);
  }

  return false;
};

const isMarkdownImage = (node: Node): node is MdastImage =>
  node.type === "image" &&
  !isExternalLink((node as MdastImage).url) &&
  !isHash((node as MdastImage).url);

type PluginOptions = {
  destinationDir: string;
  staticPath: string;
};

export default function remarkMintlifyUpdateImages({
  destinationDir,
  staticPath,
}: PluginOptions): Transformer {
  return (root) => {
    // If img is a markdown img we convert it into <img /> tag
    visit(root, isMarkdownImage, (node, index, parent: Parent) => {
      const attributes = [];

      ["url", "title", "alt"].forEach((field) => {
        if (node[field]) {
          attributes.push({
            type: "mdxJsxAttribute",
            name: field === "url" ? "src" : field,
            value: node[field],
          });
        }
      });

      parent.children[index] = {
        type: "mdxJsxFlowElement",
        name: "img",
        attributes,
      } as MdxJsxFlowElement;

      return index;
    });

    // If it is mdx <img /> add width and height
    visit(root, isMdxImg, (node: MdxJsxFlowElement | MdxJsxTextElement) => {
      const srcValue = node.attributes.find(({ name }) => name === "src")
        ?.value as string;

      const src = srcValue.replace(staticPath, `${destinationDir}/`);

      if (existsSync(src)) {
        try {
          // Read width and height from filesystem
          const { width, height } = sizeOf(src);

          // Read scale ratio from filename. E. g. @3x
          const scaleRatio = getScaleRatio(src);

          node.attributes.push(
            {
              type: "mdxJsxAttribute",
              name: "width",
              value: `${width / scaleRatio}`,
            },
            {
              type: "mdxJsxAttribute",
              name: "height",
              value: `${height / scaleRatio}`,
            }
          );
        } catch {}
      }
    });
  };
}
