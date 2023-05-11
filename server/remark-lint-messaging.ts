import { lintRule } from "unified-lint-rule";
import { visit } from "unist-util-visit";
import type { VFile } from "vfile";
import type { Position, Node, Parent } from "unist";
import type { Code, Literal } from "mdast";
import find from "unist-util-find";
import yaml from "js-yaml";

export enum PageLocation {
  Title = "title",
  Description = "description",
  Headers = "headers",
  Body = "body",
  Comments = "comments",
}

interface RemarkLintMessagingRule {
  correct: string;
  incorrect: string;
  explanation: string;
  where?: PageLocation[];
}

interface Frontmatter {
  title?: string;
  description?: string;
}

function getReadableLocation(loc: PageLocation): string {
  switch (loc) {
    case PageLocation.Title:
      return "in title";
    case PageLocation.Description:
      return "in page description";
    case PageLocation.Headers:
      return "in header";
    case PageLocation.Body:
      return "in body text";
    case PageLocation.Comments:
      return "in code comment";
  }
}

export type RemarkLintMessagingOptions = RemarkLintMessagingRule[];

// checkMessaging applies the rules in conf against text, specifying the part of
// the docs page this comes from in part.
function checkMessaging(
  conf: RemarkLintMessagingOptions,
  file: VFile,
  part: PageLocation,
  pos: Position,
  text: string
) {
  if (!Array.isArray(conf) || conf.length === 0) {
    throw new Error(
      "Cannot check messaging with an empty messaging configuration"
    );
  }

  conf.forEach((rule) => {
    // Empty text, so skip
    if (text === undefined) {
      return;
    }

    if (!Array.isArray(rule.where) || rule.where.length === 0) {
      rule.where = [
        PageLocation.Title,
        PageLocation.Description,
        PageLocation.Headers,
        PageLocation.Body,
        PageLocation.Comments,
      ];
    }

    if (!rule.where.includes(part)) {
      return;
    }

    const re = new RegExp(rule.incorrect);
    const badText = text.match(re);
    if (text.match(re)) {
      let extras = "";
      if (part == PageLocation.Body || part == PageLocation.Headers) {
        extras +=
          " (Note that the line number is not accurate if the issue occurs inside a partial.)";
      }
      if (part == PageLocation.Comments) {
        extras +=
          " (Note that the line number refers to the first line in the code snippet where the issue occurs, and is not accurate if the issue occurs inside a partial.)";
      }
      file.message(
        `Incorrect messaging: "${badText[0]}" (${getReadableLocation(
          part
        )}). ` +
          `${rule.explanation}. You should ${rule.correct}. ` +
          'Add "{/*lint ignore messaging*/}" above this line to bypass the linter.' +
          extras,
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

      checkMessaging(config, file, PageLocation.Title, node.position, title);
      checkMessaging(
        config,
        file,
        PageLocation.Description,
        node.position,
        description
      );
    }

    visit(
      root,
      isTextOrCodeNode,
      (node: Node, index: number, parent: Parent) => {
        let val: string;

        if (node.type == "code") {
          val = getCommentText((node as Code).value);
          checkMessaging(
            config,
            file,
            PageLocation.Comments,
            node.position,
            val
          );
        }

        if (parent.type == "paragraph") {
          val = (node as Literal).value;
          checkMessaging(config, file, PageLocation.Body, node.position, val);
        }

        if (parent.type == "heading") {
          val = (node as Literal).value;
          checkMessaging(
            config,
            file,
            PageLocation.Headers,
            node.position,
            val
          );
        }
      }
    );
  }
);
