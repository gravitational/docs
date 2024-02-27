/*
 * This plugin will do two things:
 * - Convert image nodex to mdx <img /> components.
 * - Add width and height for each image it can parse.
 */

import { existsSync } from "fs";
import sizeOf from "image-size";
import { visit } from "unist-util-visit";
import { isExternalLink, isHash } from "../../.build/utils/url.mjs";

const imgSizeRegExp = /@([0-9.]+)x/; // E.g. image@2x.png

const getScaleRatio = (src) => {
  if (imgSizeRegExp.test(src)) {
    const match = src.match(imgSizeRegExp);
    return parseFloat(match[1]);
  } else {
    return 1;
  }
};

const isMdxImg = (node) => {
  if (
    !["mdxJsxFlowElement", "mdxJsxTextElement"].includes(node.type) ||
    node.name !== "img"
  ) {
    return false;
  }

  const src = node.attributes.find(({ name }) => name === "src")?.value;

  return typeof src === "string" && !isExternalLink(src) && !isHash(src);
};

const isMarkdownImage = (node) =>
  node.type === "image" && !isExternalLink(node.url) && !isHash(node.url);

export default function remarkImages({ destinationDir, staticPath }) {
  return (root) => {
    visit(root, [isMarkdownImage], (node, index, parent) => {
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
      };

      return index;
    });

    visit(root, [isMdxImg], (node) => {
      const src = node.attributes
        .find(({ name }) => name === "src")
        ?.value.replace(staticPath, `${destinationDir}/`);

      if (existsSync(src)) {
        try {
          const { width, height } = sizeOf(src);
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
