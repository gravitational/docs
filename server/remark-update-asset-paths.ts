// Register MDX nodes in mdast:
/// <reference types="remark-mdx" />

import type { VFile } from "vfile";
import type { Transformer } from "unified";
import type { Root, Node, Image, Definition, Link } from "mdast";
import type {
  MdxJsxFlowElement,
  MdxJsxTextElement,
  MdxJsxAttribute,
} from "mdast-util-mdx-jsx";

import { visit } from "unist-util-visit";

type UpdaterOptions = {
  vfile: VFile;
};

type Updater = (href: string, options: UpdaterOptions) => string;

const defaultUpdater: Updater = (href: string): string => href;
const defaultAttributes = ["poster", "src", "href", "value"];

const isNodeWithUrl = (node: Node): node is Image | Link | Definition =>
  ["image", "link", "definition"].includes(node.type);

const isMdxJsxElement = (
  node: Node
): node is MdxJsxFlowElement | MdxJsxTextElement =>
  ["mdxJsxFlowElement", "mdxJsxTextElement"].includes(node.type);

type PluginOptions = {
  attributes?: string[];
  updater?: Updater;
};

export default function remarkUpdateAssetPaths({
  attributes = defaultAttributes,
  updater = defaultUpdater,
}: PluginOptions): Transformer<Root> {
  return (root: Root, vfile) => {
    visit(root, (node) => {
      if (isNodeWithUrl(node)) {
        node.url = updater(node.url, { vfile });
      }

      if (isMdxJsxElement(node)) {
        node.attributes.forEach((attribute) => {
          if (
            attributes.includes((attribute as MdxJsxAttribute).name) &&
            typeof attribute.value === "string"
          ) {
            attribute.value = updater(attribute.value, { vfile });
          }
        });
      }
    });
  };
}
