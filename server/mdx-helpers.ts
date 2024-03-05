import type { Node } from "unist";
import type { MdxJsxFlowElement, MdxJsxTextElement } from "./types-unist";

export const isMdxNode = (
  node: Node
): node is MdxJsxFlowElement | MdxJsxTextElement =>
  ["mdxJsxFlowElement", "mdxJsxTextElement"].includes(node.type);
