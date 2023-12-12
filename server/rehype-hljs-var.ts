import { unified, Transformer } from "unified";
import type { VFile } from "vfile";
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
import rehypeHighlight, {
  Options as RehypeHighlightOptions,
} from "rehype-highlight";
import { visit, CONTINUE, SKIP } from "unist-util-visit";
import { v4 as uuid } from "uuid";
import remarkParse from "remark-parse";
import type { Text, Element, Node, Parent } from "hast";
import remarkMDX from "remark-mdx";

const makePlaceholder = (): string => {
  // UUID for uniqueness, but remove hyphens since these are often parsed
  // as operators or other non-identifier tokens. Make sure the placeholder
  // begins with a letter so it gets parsed as an identifier.
  return "var" + uuid().replaceAll("-", "");
};

const placeholderPattern = "var[a-z0-9]{32}";

export const rehypeVarInHLJS = (
  options?: RehypeHighlightOptions
): Transformer => {
  return (root: Parent, file: VFile) => {
    const highlighter = rehypeHighlight(options);

    let placeholdersToVars: Record<string, MdxJsxFlowElement> = {};

    // In a code snippet, Var elements are parsed as text. Replace these with
    // UUID strings to ensure that the parser won't split these up and make
    // them unrecoverable.
    visit(root, undefined, (node: Node, index: number, parent: Parent) => {
      if (
        node.type === "text" &&
        parent.hasOwnProperty("tagName") &&
        (parent as Element).tagName === "code"
      ) {
        const varPattern = new RegExp("<Var [^>]+/>", "g");
        (node as Text).value = (node as Text).value.replace(
          varPattern,
          (match) => {
            const placeholder = makePlaceholder();
            // Since the Var element was originally text, parse it so we can recover
            // its properties. The result should be a small HTML AST with a root
            // node and one child, the Var node.
            const varElement = unified()
              .use(remarkParse)
              .use(remarkMDX)
              .parse(match);
            if (
              varElement.children.length !== 1 ||
              (varElement.children[0] as MdxJsxFlowElement).name !== "Var"
            ) {
              throw new Error(
                `Problem parsing file ${file.path}: malformed Var element within a code snippet`
              );
            }

            placeholdersToVars[placeholder] = varElement
              .children[0] as MdxJsxFlowElement;
            return placeholder;
          }
        );
      }
    });

    // Apply syntax highlighting
    (highlighter as Function)(root);

    // After syntax highlighting, the content of the code snippet will be a
    // series of span elements with different "hljs-*" classes. Find the
    // placeholder UUIDs and replace them with their original Var elements,
    // inserting these as HTML AST nodes.
    visit(root, undefined, (node: Node, index: number, parent: Parent) => {
      const el = node as Element;
      if (
        el.type === "element" &&
        el.tagName === "span" &&
        el.children.length === 1 &&
        el.children[0].type === "text"
      ) {
        const hljsSpanValue = (el.children[0] as Text).value;

        // This is an hljs span with only the placeholder as its child.
        // We don't need the span, so replace it with the original Var.
        if (placeholdersToVars[hljsSpanValue]) {
          (parent as any).children[index] = placeholdersToVars[hljsSpanValue];
          return [CONTINUE];
        }

        const placeholders = Array.from(
          hljsSpanValue.matchAll(new RegExp(placeholderPattern, "g"))
        );

        // No placeholders to recover, so there's nothing more to do.
        if (placeholders.length == 0) {
          return [CONTINUE];
        }

        // An hljs span's text includes one or more Vars among other content, so
        // we need to replace the span with a series of spans separated by
        // Vars.
        let lastIndex = 0;
        let newChildren: Array<MdxJsxFlowElement | Element> = [];
        // If there is content before the first Var, separate it into a new hljs
        // span.
        if (placeholders[0].index > 0) {
          newChildren.push({
            tagName: "span",
            type: "element",
            properties: el.properties,
            children: [
              {
                type: "text",
                value: hljsSpanValue.substring(
                  lastIndex,
                  placeholders[0].index
                ),
              },
            ],
          });
          lastIndex = placeholders[0].index;
        }
        placeholders.forEach((ph, i) => {
          const placeholderValue = ph[0];
          newChildren.push(placeholdersToVars[placeholderValue]);
          lastIndex += placeholderValue.length;

          // Check if there is some non-Var text between either (a) this and the
          // next Var or (b) between this Var and the end of the content. If
          // so, add another span and advance the last index.
          let nextIndex = 0;
          if (i < placeholders.length - 1) {
            nextIndex = placeholders[i + 1].index;
          } else if (i == placeholders.length - 1) {
            nextIndex = hljsSpanValue.length;
          }
          if (lastIndex < nextIndex) {
            newChildren.push({
              tagName: "span",
              type: "element",
              properties: el.properties,
              children: [
                {
                  type: "text",
                  value: hljsSpanValue.substring(lastIndex, nextIndex),
                },
              ],
            });
            lastIndex = nextIndex;
          }
        });
        // Delete the current span and replace it with the new children.
        (parent.children as Array<MdxJsxFlowElement | Element>).splice(
          index,
          1,
          ...newChildren
        );
        return [SKIP, index + newChildren.length];
      }
    });
  };
};
