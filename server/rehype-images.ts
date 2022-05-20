/*
 * this plugin will do two things:
 * - Add width and height for each image it can parse.
 * - Remove wrapping <p> tag around the img elements so we can use
 *   them inside the <figure> tags.
 */

import { existsSync, readFileSync } from "fs";
import probe from "probe-image-size";
import { Transformer } from "unified";
import { Element, Root } from "hast";
import { visitParents, SKIP } from "unist-util-visit-parents";
import { isExternalLink, isHash } from "../utils/url";

interface ImageElement extends Element {
  properties: {
    src: string;
    width?: number;
    height?: number;
  };
}

const isLocalImg = (node): node is ImageElement =>
  node.type === "element" &&
  node.tagName === "img" &&
  typeof node.properties.src === "string" &&
  !isExternalLink(node.properties.src) &&
  !isHash(node.properties.src);

const isParagraphWithImageInside = (node): node is Element =>
  node.type === "element" &&
  node.tagName === "p" &&
  node.children.some(isLocalImg);

const imgSizeRegExp = /@([0-9.]+)x/; // E.g. image@2x.png

const getScaleRatio = (src: string) => {
  if (imgSizeRegExp.test(src)) {
    const match = src.match(imgSizeRegExp);

    return parseFloat(match[1]);
  } else {
    return 1;
  }
};

interface RehypeImagesProps {
  destinationDir: string;
  staticPath: string;
}

export default function rehypeImages({
  destinationDir,
  staticPath,
}: RehypeImagesProps): Transformer {
  return (root: Root) => {
    visitParents(root, [isLocalImg], (node: ImageElement) => {
      const src = node.properties.src.replace(staticPath, `${destinationDir}/`);

      if (existsSync(src)) {
        const file = readFileSync(src);

        try {
          const { width, height } = probe.sync(file);
          const scaleRatio = getScaleRatio(src);

          node.properties.width = width / scaleRatio;
          node.properties.height = height / scaleRatio;
        } catch {}
      }
    });

    /*
      Passing images wrapper in `<p>` inside <Figure> can break it, so we unwrap them here.
    */

    visitParents(
      root,
      [isParagraphWithImageInside],
      (paragraphNode: Element, ancestors) => {
        const parent = ancestors[ancestors.length - 1] as Element;
        const paragraphIndex = parent.children.indexOf(paragraphNode);

        // If paragraph has only one child and it is image - just unwrap it
        if (paragraphNode.children.length === 1) {
          parent.children[paragraphIndex] = paragraphNode.children[0];
          // If the image in not the only child - unwrap images while leaving
          // content before and after each image inside the <p> tags.
        } else {
          const newNodes = [];
          let currentParagraph: Element | undefined;

          paragraphNode.children.forEach((node, index) => {
            if (isLocalImg(node)) {
              if (currentParagraph) {
                newNodes.push(currentParagraph);
                currentParagraph = undefined;
              }

              newNodes.push(node);
            } else {
              if (!currentParagraph) {
                currentParagraph = {
                  type: "element",
                  tagName: "p",
                  children: [node],
                };
              } else {
                currentParagraph.children.push(node);
              }

              if (index === paragraphNode.children.length - 1) {
                newNodes.push(currentParagraph);
              }
            }
          });

          parent.children.splice(paragraphIndex, 1, ...newNodes);

          return [SKIP, paragraphIndex + newNodes.length];
        }
      }
    );
  };
}
