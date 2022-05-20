/*
 * This plugin will transform code snippets like this:
 *
 * ```code
 * # Copy and Paste the below and run on the Teleport Auth server.
 * $ cat > api-role.yaml <<ENDOFMESSAGE
 * kind: role
 * metadata:
 *   name: api-role
 * spec:
 *   allow:
 *     rules:
 *       - resources: ['role']
 *         verbs: ['read']
 *   deny:
 *     node_labels:
 *       '*': '*'
 * version: v3
 * ```
 *
 * To the widget in which every command can be copied separately.
 *
 * See fixtures/includes and tests for more examples.
 */

import type { Transformer } from "unified";
import type { Code as MdastCode } from "mdast";
import type {
  MdxastNode,
  MdxJsxAttribute,
  MdxJsxFlowElement,
  MdxAnyElement,
} from "./types-unist";

import { visit } from "unist-util-visit";

const RULE_ID = "code-snippet";

const isCode =
  (langs: string[]) =>
  (node: MdxastNode): node is MdastCode =>
    node.type === "code" && langs.includes(node.lang);

const getCommandNode = (content: string, prefix = "$"): MdxJsxFlowElement => ({
  type: "mdxJsxFlowElement",
  name: "Command",
  attributes: [],
  children: [
    {
      type: "mdxJsxFlowElement",
      name: "CommandLine",
      attributes: [
        {
          type: "mdxJsxAttribute",
          name: "data-content",
          value: `${prefix} `,
        },
      ],
      children: [
        {
          type: "text",
          value: content,
        },
      ],
    },
  ],
});

const getLineNode = (content: string, attributes = []): MdxJsxFlowElement => ({
  type: "mdxJsxFlowElement",
  name: "CommandLine",
  attributes,
  children: [
    {
      type: "text",
      value: content,
    },
  ],
});

const getCommentNode = (
  content: string,
  attributes: MdxJsxAttribute[] = []
): MdxJsxFlowElement => ({
  type: "mdxJsxFlowElement",
  name: "CommandComment",
  attributes,
  children: [
    {
      type: "text",
      value: content,
    },
  ],
});

export interface RemarkCodeSnippetOptions {
  langs: string[];
  lint?: boolean;
  resolve?: boolean;
}

export default function remarkCodeSnippet({
  langs = ["code"],
  lint = false,
  resolve = false,
}: RemarkCodeSnippetOptions): Transformer {
  return (root, vfile) => {
    visit(
      root,
      isCode(langs),
      (node: MdastCode, index, parent: MdxAnyElement) => {
        const content: string = node.value;
        const codeLines = content.split("\n");
        const children = [];

        for (let i = 0; i < codeLines.length; i++) {
          const hasLeadingDollar = codeLines[i][0] === "$";
          const hasHost = codeLines[i][0] === ">" && codeLines[i].includes("$");
          const hasGrate = codeLines[i][0] === "#";
          const trimmedValue = codeLines[i].slice(1).trim();

          if (hasLeadingDollar) {
            children.push(getCommandNode(trimmedValue));

            const commandArrayElem = children[children.length - 1].children;

            if (codeLines[i].includes("<<")) {
              let heredocMark = codeLines[i].match(/[^<<]*$/)[0].trim();

              if (heredocMark.includes(">")) {
                heredocMark = heredocMark.split(">")[0].trim();
              }

              if (heredocMark.includes("'")) {
                heredocMark = heredocMark.match(/'(.*?)'/)[1];
              }

              if (heredocMark.indexOf("-") === 0) {
                heredocMark = heredocMark.slice(1);
              }

              while (codeLines[i] && codeLines[i] !== heredocMark) {
                commandArrayElem.push(getLineNode(codeLines[i + 1]));

                i++;
              }

              if (codeLines.every((line) => line !== heredocMark)) {
                if (lint) {
                  vfile.fail(
                    "No closing line for heredoc format",
                    node,
                    RULE_ID
                  );
                } else {
                  console.error(
                    `ERROR: no closing line ${heredocMark} in the file ${vfile.path}`
                  );
                }
              }
            }

            let hasNextLine = codeLines[i]?.[codeLines[i]?.length - 1] === "\\";

            while (hasNextLine) {
              commandArrayElem.push(getLineNode(codeLines[i + 1]));

              i++;
              hasNextLine =
                Boolean(codeLines[i]) &&
                codeLines[i][codeLines[i].length - 1] === "\\";

              if (lint && !codeLines[i]) {
                vfile.fail(
                  "The last string in the multiline command has to be without symbol \\",
                  node,
                  RULE_ID
                );
              }
            }
          } else if (hasHost) {
            const parts = codeLines[i].split("$");
            const ghostText = `${parts[0].slice(1).trim()} $`;
            const commandText = parts[1].trim();

            children.push(getCommandNode(commandText, ghostText));
          } else if (hasGrate) {
            if (codeLines[i][1] === "#") {
              children.push(getCommentNode(codeLines[i].slice(1)));
            } else {
              children.push(
                getCommentNode(trimmedValue, [
                  {
                    type: "mdxJsxAttribute",
                    name: "data-type",
                    value: "descr",
                  },
                ])
              );
            }
          } else {
            children.push(getCommentNode(codeLines[i]));
          }
        }

        parent.children[index] = {
          type: "mdxJsxFlowElement",
          name: "Snippet",
          attributes: [],
          children,
        } as MdxJsxFlowElement;
      }
    );
  };
}
