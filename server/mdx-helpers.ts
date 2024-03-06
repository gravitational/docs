import type { Node } from "unist";
import type {
  MdxJsxElement,
  MdxJsxAttribute,
  MdxJsxAttributeValue,
} from "./types-unist";

export const isMdxNode = (node: Node): node is MdxJsxElement =>
  ["mdxJsxFlowElement", "mdxJsxTextElement"].includes(node.type);

export const getAttribute = (
  node: MdxJsxElement,
  attributeName: string
): MdxJsxAttribute | undefined => {
  return node.attributes.find(({ name }) => attributeName === name);
};

export const getAttributeValue = (
  node: MdxJsxElement,
  attributeName: string
): MdxJsxAttributeValue | undefined => {
  return getAttribute(node, attributeName)?.value;
};
