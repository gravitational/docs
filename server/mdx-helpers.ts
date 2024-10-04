import type { Node } from "unist";
import type {
  MdxJsxElement,
  MdxJsxAttribute,
  MdxJsxAttributeValue,
} from "./types-unist";

// Check if a node is an MDX node.

export const isMdxNode = (node: Node): node is MdxJsxElement =>
  ["mdxJsxFlowElement", "mdxJsxTextElement"].includes(node.type);

// Get an attribute from an MDX node.

export const getAttribute = (
  node: MdxJsxElement,
  attributeName: string
): MdxJsxAttribute | undefined => {
  return node.attributes.find(({ name }) => attributeName === name);
};

// Get an attribute value from an MDX node.

export const getAttributeValue = (
  node: MdxJsxElement,
  attributeName: string
): MdxJsxAttributeValue | undefined => {
  return getAttribute(node, attributeName)?.value;
};
