/*
 * This plugin converts custom tags to Mintlify format.
 */

import { visit } from "unist-util-visit";

const getComponentName = (type) => {
  switch (type) {
    case "tip":
      return "Tip";
    case "warning":
      return "Warning";
    default:
      return "Note";
  }
};

const isMdxNode = (node) =>
  ["mdxJsxFlowElement", "mdxJsxTextElement"].includes(node.type);

export default function remarkMigrateTags() {
  return (root) => {
    visit(root, (node, index, parent) => {
      // TabItem
      if (isMdxNode(node) && node.name === "TabItem") {
        parent.children[index] = {
          type: node.type,
          name: "Tab",
          attributes: [
            {
              type: "mdxJsxAttribute",
              name: "title",
              value: node.attributes.find(({ name }) => name === "label").value,
            },
          ],
          children: node.children,
        };

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
              value: node.attributes.find(({ name }) => name === "title").value,
            },
          ],
          children: node.children,
        };

        return index; // to traverse children
      }

      // Notice and Admonition
      if (isMdxNode(node) && ["Notice", "Admonition"].includes(node.name)) {
        parent.children[index] = {
          type: node.type,
          attributes: [],
          name: getComponentName(
            node.attributes.find(({ name }) => name === "type")?.value || "note"
          ),
          children: node.children,
        };

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
          value: node.attributes
            .find(({ name }) => name === "name")
            ?.value?.toUpperCase(),
        };
      }

      // Replace Var in clode blocks
      if (node.type === "code") {
        const regexNode = /(\<\s*Var\s+(.*?)\s*\/\>)/g;
        const regexProperty = /([a-z]+)\s*=\s*"([^"]*?)"/gi;

        node.value = node.value.replaceAll(regexNode, (match) => {
          const propsHash = Array.from(match.matchAll(regexProperty)).reduce(
            (result, value) => {
              return { ...result, [value[1]]: value[2] };
            },
            {}
          );

          return propsHash.initial || propsHash.name;
        });
      }

      // Remove "code" code type
      if (node.type === "code") {
        if (node.lang === "code") {
          node.lang === "bash";
        }
      }

      // Remove string styles from nodes
      if (isMdxNode(node)) {
        const hasStringStyles = (attrs) =>
          attrs.name === "style" && typeof attrs.value === "string";

        node.attributes = node.attributes.filter(
          (attrs) => !hasStringStyles(attrs)
        );
      }
    });
  };
}
