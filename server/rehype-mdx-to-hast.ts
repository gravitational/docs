/*
 * this is a plugin that converts subset of mdx nodes to hast.
 */

import type { Transformer } from "unified";
import type { Parent } from "unist";
import type {
  MdxJsxFlowElement,
  MdxJsxTextElement,
  MdxJsxAttribute,
  MdxJsxAttributeValueExpression,
} from "mdast-util-mdx-jsx";
import type { MDXJSEsm } from "mdast-util-mdxjs-esm";
import type {
  MDXFlowExpression,
  MDXTextExpression,
} from "mdast-util-mdx-expression";

import { visit } from "unist-util-visit";

// All the types of node that can be inside MDX file
type MdxNode =
  | MdxJsxFlowElement // https://github.com/syntax-tree/mdast-util-mdx-jsx/blob/main/lib/complex-types.d.ts
  | MdxJsxTextElement // https://github.com/syntax-tree/mdast-util-mdx-jsx/blob/main/lib/complex-types.d.ts
  | MDXJSEsm // https://github.com/syntax-tree/mdast-util-mdxjs-esm/blob/main/complex-types.d.ts
  | MDXFlowExpression // https://github.com/syntax-tree/mdast-util-mdx-expression/blob/main/complex-types.d.ts
  | MDXTextExpression; // https://github.com/syntax-tree/mdast-util-mdx-expression/blob/main/complex-types.d.ts

export default function rehypeMdxToHast(): Transformer {
  return (root: Parent) => {
    visit(root, (node: MdxNode, index: number, parent: Parent) => {
      // TextElement in an inline tag and FlowElement is a block tag. e want ot convert them.
      if (
        node.type === "mdxJsxTextElement" ||
        node.type === "mdxJsxFlowElement"
      ) {
        const newNode = {
          type: "element",
          tagName: node.name.toLowerCase(),
          properties: (node.attributes as MdxJsxAttribute[]).reduce(
            (result, prop) => {
              // If the prop in markdown was a js-expression like disabled={true}
              // it will be parsed as an object with original value as a string
              // and as a estree. For now we just use the string value.
              if (typeof prop.value === "object" && prop.value !== null) {
                // Temporary fix for scopeOnly={true}, can be removed after docs update
                if (prop.name === "scopeOnly") {
                  return {
                    ...result,
                    [prop.name]: prop?.value?.value || null,
                  };
                  // Temporary fix for scope={["oss", "cloud"]}, will transform value
                  // to scope="oss,cloud". Can be removed after docs update.
                } else if (prop.name === "scope") {
                  return {
                    ...result,
                    [prop.name]: (
                      prop.value as MdxJsxAttributeValueExpression
                    ).value
                      .split(",")
                      .map((part) => part.replace(/[^a-z]+/g, ""))
                      .join(","),
                  };
                }

                // By default just return value as is. E. g. field={something}
                // will get value "{something}"" as is with curly braces.
                return {
                  ...result,
                  [prop.name]: (prop.value as MdxJsxAttributeValueExpression)
                    .value,
                };
              }

              // for non-js nodes just return value
              return {
                ...result,
                [prop.name]: prop.value === null ? true : prop.value,
              };
            },
            {}
          ),
          children: node.children,
        };

        parent.children[index] = newNode;
        // This is a pure JS nodes, like {1 + 1} or imports/exports.
        // Just removing them for now for simplicity.
      } else if (
        ["mdxFlowExpression", "mdxTextExpression", "mdxjsEsm"].includes(
          node.type
        )
      ) {
        parent.children.splice(index, 1);
      }
    });
  };
}
