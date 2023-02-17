import { lintRule } from "unified-lint-rule";
import { visit } from "unist-util-visit";
import type { VFile } from "vfile";
import type { Position, Node, Parent } from "unist";
import type { Code, Literal } from "mdast";
import find from "unist-util-find";
import yaml from "js-yaml";

interface RemarkLintMessagingRule {
  correct: string;
  incorrect: string;
  explanation: string;
}

interface Frontmatter {
  title?: string;
  description?: string;
}

export type RemarkLintMessagingOptions = RemarkLintMessagingRule[];

const allowedNodeTypes = {
  paragraph: true,
  heading: true,
};

function checkMessaging(
  conf: RemarkLintMessagingOptions,
  file: VFile,
  pos: Position,
  text: string
) {
  if (!Array.isArray(conf) || conf.length === 0) {
    throw new Error(
      "Cannot check messaging with an empty messaging configuration"
    );
  }
  conf.forEach((rule) => {
    const re = new RegExp(rule.incorrect);
    // Empty text, so skip
    if (text === undefined) {
      return;
    }
    const badText = text.match(re);
    if (text.match(re)) {
      file.message(
        `Incorrect messaging: "${badText[0]}". ${rule.explanation}. You should ${rule.correct}. ` +
          'Add "{/*lint ignore messaging*/}" above this line to bypass the linter.',
        pos
      );
    }
  });
}

function isTextOrCodeNode(node: Node) {
  return node.type === "text" || node.type === "code";
}

// getCommentText takes the text node value of a code fence, i.e., all comments
// and lines of comment, and returns the result of concatenating all comments,
// removing comment syntax. Supports:
// - /* */
// - //
// - #
function getCommentText(value: string): string {
  // Matches the start of a comment.
  const commentStart = new RegExp("^(/\\* | \\* |// |# )");
  const lines = value.split("\n");
  return lines.reduce((result, current) => {
    const match = current.match(commentStart);
    if (match !== null) {
      let txt = current.slice(match[0].length, current.length);
      // ensure that we concatenate lines without combining words
      if (current[current.length - 1] !== " ") {
        txt += " ";
      }
      return result + txt;
    }
    return result;
  }, "");
}

export const remarkLintMessaging = lintRule(
  "remark-lint:messaging",
  (
    root: Parent,
    file: VFile,
    options:
      | RemarkLintMessagingOptions
      | ((vfile: VFile) => RemarkLintMessagingOptions)
  ) => {
    let config: RemarkLintMessagingOptions;

    if (typeof options === "function") {
      config = options(file);
    } else {
      config = options;
    }

    // This is a type of the node created by remark-frontmatter plugin in remark-lint
    const node = find(root, (node: Node) => node.type === "yaml");

    // If there's no frontmatter, we'll let other linting steps take care of
    // it.
    if (node !== undefined) {
      const frontmatter = yaml.load(node.value as string) as Frontmatter;
      const { title, description } = frontmatter;

      checkMessaging(config, file, node.position, title);
      checkMessaging(config, file, node.position, description);
    }

    visit(
      root,
      isTextOrCodeNode,
      (node: Node, index: number, parent: Parent) => {
        let val: string;

        if (node.type == "code") {
          val = getCommentText((node as Code).value);
        }

        if (parent.type == "paragraph" || parent.type == "heading") {
          val = (node as Literal).value;
        }

        checkMessaging(config, file, node.position, val);
      }
    );
  }
);
