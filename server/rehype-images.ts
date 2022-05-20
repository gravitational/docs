import { existsSync, readFileSync } from "fs";
import probe from "probe-image-size";
import { Transformer } from "unified";
import { Element, Root } from "hast";
import { visitParents } from "unist-util-visit-parents";
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
  };
}
