/*
 * This plugin converts custom tags to Mintlify format.
 */

import type { Transformer } from "unified";
import type { Node, Parent } from "unist";
import type { Text as MdastText, Code as MdastCode } from "mdast";
import type { MdxJsxElement } from "./types-unist";

import { nanoid } from "nanoid";
import { visit } from "unist-util-visit";
import { isMdxNode, getAttribute, getAttributeValue } from "./mdx-helpers";

// const componentNames = new Map([
//   ["tip", "Tip"],
//   ["warning", "Warning"],
//   ["note", "Note"],
// ]);

const isCodeNode = (node: Node): node is MdastCode => node.type === "code";

export default function remarkMigrationUpdateTags(): Transformer {
  return (root) => {
    visit(root, (node, index, parent: Parent) => {
      // TabItem
      if (isMdxNode(node) && ["TabItem", "TabsItem"].includes(node.name)) {
        node.name = "TabItem";
        node.attributes.push({
          value: nanoid(),
          name: "value",
          type: "mdxJsxAttribute",
        });
      }

      // Details
      if (isMdxNode(node) && node.name === "Details") {
        parent.children[index] = {
          type: "mdxJsxFlowElement",
          name: "details",
          attributes: [],
          children: [
            {
              type: "mdxJsxFlowElement",
              name: "summary",
              attributes: [],
              children: [
                {
                  type: "text",
                  value: getAttributeValue(node, "title"),
                },
              ],
            },
            {
              type: "mdxJsxFlowElement",
              name: "div",
              attributes: [],
              children: node.children,
            },
          ],
        } as MdxJsxElement;

        return index; // to traverse children
      }

      // Notice and Admonition
      if (isMdxNode(node) && node.name === "Notice") {
        node.name = "Admonition";
      }

      if (isMdxNode(node) && node.name === "Admonition") {
        const type = getAttribute(node, "type");

        if (!type) {
          node.attributes.push({
            type: "mdxJsxAttribute",
            name: "type",
            value: "info",
          });
        } else {
          type.value = (type.value as string).toLowerCase();

          if (type.value === "notice") {
            type.value = "note";
          }
        }
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
