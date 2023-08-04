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

const getTextChildren = (contentValue: string): MdxastNode => ({
  type: "text",
  value: contentValue,
});

const getVariableNode = (
  value: string,
  isGlobal: boolean,
  description: string | boolean
): MdxJsxFlowElement => {
  const descriptionValue = description ? description : "";

  return {
    type: "mdxJsxFlowElement",
    name: "Var",
    attributes: [
      { type: "mdxJsxAttribute", name: "name", value },
      {
        type: "mdxJsxAttribute",
        name: "isGlobal",
        value: isGlobal.toString(),
      },
      {
        type: "mdxJsxAttribute",
        name: "description",
        value: `${descriptionValue}`,
      },
    ],
    children: [],
  };
};

const getChildrenNode = (content: string): MdxastNode[] => {
  const hasVariable = content?.includes("<Var");
  const nodeChildren: MdxastNode[] = [];

  if (hasVariable) {
    const contentVars = content.match(/(?:\<Var .+?\/\>)/gm);
    const firstPartLine = content.split("<Var")[0];
    nodeChildren.push(getTextChildren(firstPartLine));
    let newContent = content.replace("isGlobal", "");

    for (let i = 0; i < contentVars.length; i++) {
      if (contentVars[i].includes("description=")) {
        newContent = newContent.replace(
          contentVars[i].match(/description="(.*?)"/)[1],
          ""
        );
        newContent = newContent.replace('description=""', "");
      }

      let nextPartLine = newContent.split("/>")[i + 1];
      if (nextPartLine?.includes("<Var")) {
        nextPartLine = nextPartLine.split("<Var")[0];
      }

      const varName = contentVars[i].match(/name="(.*?)"/)[1];
      const description =
        contentVars[i].includes("description=") &&
        contentVars[i].match(/description="(.*?)"/)[1];
      const isGlobal = contentVars[i].includes("isGlobal");
      nodeChildren.push(getVariableNode(varName, isGlobal, description));
      nodeChildren.push(getTextChildren(nextPartLine));
    }
  } else {
    nodeChildren.push(getTextChildren(content));
  }

  return nodeChildren;
};

const getCommandNode = (content: string, prefix = "$"): MdxJsxFlowElement => {
  const children = getChildrenNode(content);

  return {
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
        children: children,
      },
    ],
  };
};

const getLineNode = (content: string, attributes = []): MdxJsxFlowElement => {
  const children = getChildrenNode(content);

  return {
    type: "mdxJsxFlowElement",
    name: "CommandLine",
    attributes,
    children: children,
  };
};

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

const getCodeLine = (
  content: string,
  attributes: MdxJsxAttribute[] = []
): MdxJsxFlowElement => {
  const children = getChildrenNode(content);

  return {
    type: "mdxJsxFlowElement",
    name: "CodeLine",
    attributes,
    children: children,
  };
};

export interface RemarkCodeSnippetOptions {
  langs: string[];
  lint?: boolean;
  resolve?: boolean;
}

export default function remarkCodeSnippet({
  langs = ["code"],
  lint = false,
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
            children.push(getCodeLine(codeLines[i]));
            // This is an empty code line. Make sure it renders correctly by
            // pushing a <br> element after it. Otherwise, this becomes an
            // empty "CodeLine" element that does not display unless we apply
            // styling that could have unintended effects on other CodeLines.
            if (codeLines[i] == "") {
              children.push({
                type: "mdxJsxFlowElement",
                name: "br",
                attributes: [],
              });
            }
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
