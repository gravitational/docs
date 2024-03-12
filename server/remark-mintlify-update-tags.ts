/*
 * This plugin converts custom tags to Mintlify format.
 */

import type { Transformer } from "unified";
import type { Node, Parent } from "unist";
import type { Text as MdastText, Code as MdastCode } from "mdast";
import type { MdxJsxElement, MdxJsxAttribute } from "./types-unist";

import { visit } from "unist-util-visit";
import { isMdxNode, getAttributeValue } from "./mdx-helpers";

const componentNames = new Map([
  ["tip", "Tip"],
  ["warning", "Warning"],
  ["note", "Note"],
]);

const isCodeNode = (node: Node): node is MdastCode => node.type === "code";

export default function remarkMintlifyUpdateTags(): Transformer {
  return (root) => {
    visit(root, (node, index, parent: Parent) => {
      // TabItem
      if (isMdxNode(node) && node.name === "TabItem") {
        const newNode = {
          type: node.type,
          name: "Tab",
          attributes: [
            {
              type: "mdxJsxAttribute",
              name: "title",
              value: getAttributeValue(node, "label"),
            } as MdxJsxAttribute,
          ],
          children: node.children,
        } as MdxJsxElement;

        parent.children[index] = newNode;

        return index; // to traverse children
      }

      // Details
      if (isMdxNode(node) && node.name === "Details") {
        parent.children[index] = {
          type: node.type,
          name: "Accordion",
          attributes: [
            {
              type: "mdxJsxAttribute",
              name: "title",
              value: getAttributeValue(node, "title"),
            },
          ],
          children: node.children,
        } as MdxJsxElement;

        return index; // to traverse children
      }

      // Notice and Admonition
      if (isMdxNode(node) && ["Notice", "Admonition"].includes(node.name)) {
        const title = getAttributeValue(node, "title");

        // Put title
        if (typeof title === "string") {
          if (node.children.length === 1 && node.children[0].type === "text") {
            node.children[0] = {
              type: "mdxJsxFlowElement",
              name: "p",
              attributes: [],
              children: [node.children[0]],
            };
          }

          node.children.unshift({
            type: "mdxJsxFlowElement",
            name: "p",
            attributes: [],
            children: [
              { type: "strong", children: [{ type: "text", value: title }] },
            ],
          });
        }

        parent.children[index] = {
          type: node.type,
          attributes: [],
          name:
            componentNames.get(getAttributeValue(node, "type") as string) ||
            "Note",
          children: node.children,
        } as MdxJsxElement;

        return index; // to traverse children
      }

      // Unwrap Component
      if (
        isMdxNode(node) &&
        [
          "Figure",
          "TileSet",
          "TileList",
          "TileListItem",
          "ScopedBlock",
        ].includes(node.name)
      ) {
        parent.children.splice(index, 1, ...node.children); // unwrap children

        return index; // to traverse children
      }

      // Remove components
      if (isMdxNode(node) && ["Icon", "VarList"].includes(node.name)) {
        parent.children.splice(index, 1);

        return index; // index of the next element to traverse, in this case repeat the same index again
      }

      // Replace Var with uppercase content
      if (isMdxNode(node) && node.name === "Var") {
        parent.children[index] = {
          type: "text",
          value:
            getAttributeValue(node, "initial") ||
            getAttributeValue(node, "name"),
        } as MdastText;
      }

      // Replace Var in clode blocks
      if (isCodeNode(node)) {
        const regexNode = /(\<\s*Var\s+(.*?)\s*\/\>)/g;
        const regexProperty = /([a-z]+)\s*=\s*"([^"]*?)"/gi;

        node.value = node.value.replaceAll(regexNode, (match) => {
          const propsHash = Array.from(match.matchAll(regexProperty)).reduce(
            (result, value) => {
              return { ...result, [value[1]]: value[2] };
            },
            {} as { initial: string; name: string }
          );

          return propsHash.initial || propsHash.name;
        });
      }

      // Remove "code" code type
      if (isCodeNode(node)) {
        if (node.lang === "code") {
          node.lang = "bash";
        }
      }

      // Remove string styles from nodes
      if (isMdxNode(node)) {
        node.attributes = node.attributes.filter(
          (attrs) =>
            !(attrs.name === "style" && typeof attrs.value === "string")
        );
      }
    });
  };
}
