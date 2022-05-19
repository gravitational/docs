/*
 * this is a plugin that converts suset of mdx nodes to hast.
 *
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

type MdxNode =
  | MdxJsxFlowElement
  | MdxJsxTextElement
  | MDXJSEsm
  | MDXFlowExpression
  | MDXTextExpression;

export default function rehypeMdxToHast(): Transformer {
  return (root: Parent) => {
    visit(root, (node: MdxNode, index: number, parent: Parent) => {
      // https://github.com/syntax-tree/mdast-util-mdx-jsx/blob/main/lib/complex-types.d.ts
      if (
        node.type === "mdxJsxTextElement" ||
        node.type === "mdxJsxFlowElement"
      ) {
        const newNode = {
          type: "element",
          tagName: node.name.toLowerCase(),
          properties: (node.attributes as MdxJsxAttribute[]).reduce(
            (result, prop) => {
              if (typeof prop.value === "object" && prop.value !== null) {
                if (prop.name === "scopeOnly") {
                  return {
                    ...result,
                    [prop.name]: null,
                  };
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

                return {
                  ...result,
                  [prop.name]: (prop.value as MdxJsxAttributeValueExpression)
                    .value,
                };
              }

              return { ...result, [prop.name]: prop.value };
            },
            {}
          ),
          children: node.children,
        };

        parent.children[index] = newNode;
      } else if (
        // https://github.com/syntax-tree/mdast-util-mdx-expression/blob/main/complex-types.d.ts
        // https://github.com/syntax-tree/mdast-util-mdxjs-esm/blob/main/complex-types.d.ts
        ["mdxFlowExpression", "mdxTextExpression", "mdxjsEsm"].includes(
          node.type
        )
      ) {
        parent.children.splice(index, 1);
      }
    });
  };
}
