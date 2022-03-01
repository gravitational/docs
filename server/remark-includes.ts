/*
 * This plugin will resolve (!filename!) syntax and include file's content
 * Inside the page. mdx and md files will also be parsed to AST and then used as normal
 * mdx content. Paths to includes are resolved form the version repo root.
 *
 * This plugin can also work as a linter plugin for remark-lint.
 *
 * See tests and fixtures for more examples.
 */

import type { Parent } from "unist";
import type { Content, Code, Text } from "mdast";
import type { VFile } from "vfile";

import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { visitParents } from "unist-util-visit-parents";

import { fromMarkdown } from "mdast-util-from-markdown";

import { mdxjs } from "micromark-extension-mdxjs";
import { gfm } from "micromark-extension-gfm";
import { frontmatter } from "micromark-extension-frontmatter";

import { mdxFromMarkdown } from "mdast-util-mdx";
import { gfmFromMarkdown } from "mdast-util-gfm";
import { frontmatterFromMarkdown } from "mdast-util-frontmatter";

import updateMessages from "./update-vfile-messages";

const includeRegexpBase = "\\(!([^!]+)!\\)`?";
const includeRegexp = new RegExp(includeRegexpBase);
const exactIncludeRegexp = new RegExp(`^${includeRegexpBase}$`);
const globalIncludeRegexp = new RegExp(includeRegexpBase, "g");

interface ResolveIncludesProps {
  value: string;
  filePath: string;
  rootDir: string;
}

const resolveIncludes = ({
  value,
  filePath,
  rootDir,
}: ResolveIncludesProps) => {
  let error: string;

  const result = value.replace(includeRegexp, (_, includePath) => {
    const fullImportPath = join(rootDir, includePath);

    if (existsSync(fullImportPath)) {
      return readFileSync(fullImportPath, "utf-8");
    } else {
      error = `Wrong import path ${includePath} in file ${filePath}.`;

      return `(!${includePath}!)`;
    }
  });

  return { result, error };
};

const numIncludes = (value: string) => value.match(globalIncludeRegexp).length;

const isInclude = (node: Code | Text): node is Code | Text =>
  typeof node.value === "string" && includeRegexp.test(node.value);

export interface RemarkIncludesOptions {
  rootDir?: string | ((vfile: VFile) => string);
  lint?: boolean;
  resolve?: boolean;
}

export default function remarkIncludes({
  rootDir = "",
  lint,
  resolve = true,
}: RemarkIncludesOptions = {}) {
  return (root: Content, vfile: VFile) => {
    let resolvedRootDir: string;

    if (typeof rootDir === "function") {
      resolvedRootDir = rootDir(vfile);
    } else {
      resolvedRootDir = rootDir;
    }

    const lastErrorIndex = vfile.messages.length;

    visitParents(root, [isInclude], (node, ancestors: Parent[]) => {
      if (node.type === "code") {
        const noIncludes = numIncludes(node.value);
        for (let i = 0; i < noIncludes; i++) {
          const { result, error } = resolveIncludes({
            value: node.value,
            filePath: vfile.path,
            rootDir: resolvedRootDir,
          });

          if (resolve) {
            node.value = result;
          }

          if (lint && error) {
            vfile.message(error, node);
          }
        }
      } else if (node.type === "text") {
        const parent = ancestors[ancestors.length - 1];

        if (parent.type === "paragraph") {
          if (parent.children && parent.children.length === 1) {
            if (exactIncludeRegexp.test(node.value.trim())) {
              const { result, error } = resolveIncludes({
                value: node.value,
                filePath: vfile.path,
                rootDir: resolvedRootDir,
              });

              const path = node.value.match(exactIncludeRegexp)[1];

              if (resolve) {
                if (path.match(/\.mdx?$/)) {
                  const tree = fromMarkdown(result, {
                    extensions: [mdxjs(), gfm(), frontmatter()],
                    mdastExtensions: [
                      mdxFromMarkdown,
                      gfmFromMarkdown(),
                      frontmatterFromMarkdown(["yaml"]),
                    ],
                  });

                  const grandParent = ancestors[ancestors.length - 2] as Parent;
                  const parentIndex = grandParent.children.indexOf(parent);

                  grandParent.children.splice(parentIndex, 1, ...tree.children);
                } else {
                  node.value = result;
                }
              }

              if (lint && error) {
                vfile.message(error, node);
              }
            } else if (lint) {
              vfile.message(
                "Includes only works if they are the only content on the line",
                node
              );
            }
          } else if (lint) {
            vfile.message(
              "Includes only works if they are the only content on the line",
              node
            );
          }
        }
      } else if (lint) {
        vfile.message("Includes only work in paragraphs and code blocks", node);
      }
    });

    updateMessages({
      vfile,
      startIndex: lastErrorIndex,
      ruleId: "includes",
      source: "remark-lint",
    });
  };
}
