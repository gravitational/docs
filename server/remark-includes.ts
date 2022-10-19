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
import type { Node } from "mdast-util-from-markdown/lib";
import { dirname, join, relative } from "path";

import { existsSync, readFileSync } from "fs";
import { visitParents } from "unist-util-visit-parents";
import { fromMarkdown } from "mdast-util-from-markdown";

import { mdxjs } from "micromark-extension-mdxjs";
import { gfm } from "micromark-extension-gfm";
import { frontmatter } from "micromark-extension-frontmatter";

import { mdxFromMarkdown } from "mdast-util-mdx";
import { gfmFromMarkdown } from "mdast-util-gfm";
import { frontmatterFromMarkdown } from "mdast-util-frontmatter";

import updateMessages from "./update-vfile-messages";

const includeRegexpBase = "\\(!(.*)!\\)`?";
const includeRegexp = new RegExp(includeRegexpBase);
const exactIncludeRegexp = new RegExp(`^${includeRegexpBase}$`);
const globalIncludeRegexp = new RegExp(includeRegexpBase, "g");
const varDefaultValueRegexp = new RegExp(`{{ ?.+=["']([^"']+)["'] ?}}`, "g");

interface ResolveIncludesProps {
  value: string;
  filePath: string;
  rootDir: string;
}

export interface ParameterAssignments {
  [index: string]: string;
}

// parsePartialParams takes a partial inclusion expression and parses the
// parameter assignments that follow the filepath. For example, if the
// expression is:
//
// (!partial.mdx var1="val" var2="val"!)
//
// ...it returns a ParameterAssignments with keys for "var1" and "var2".
// This function is intended to separate different parameter assignments for
// processing downstream.
//
// TODO(ptgott): I wasn't able to use regular expressions for this, and the
// current approach is pretty ugly. There's got to be a cleaner, more efficient
// way.
export function parsePartialParams(expr: string): ParameterAssignments {
  if (!expr) {
    return {};
  }

  if (!exactIncludeRegexp.test(expr)) {
    throw new Error("the expression does not include a partial");
  }

  // extract everything after the filepath and before the "!)"
  const val = expr.slice(expr.indexOf(" "), expr.length - 2);

  const keyRegexp = new RegExp(`[^= "']`);
  let assignments: ParameterAssignments = {};
  let inQuotedString: boolean = false;
  let currentQuoteStyle: string = "";
  let inKey: boolean = false;
  let currentKey: string = "";
  let currentVal: string = "";
  for (let c = 0; c < val.length; c++) {
    // We find a quote that's not escaped
    if ((val[c] == `"` || val[c] == "'") && (c == 0 || val[c - 1] !== "\\")) {
      inKey = false;
      // This is the beginning of a quoted string
      if (!inQuotedString) {
        inQuotedString = true;
        currentQuoteStyle = val[c];
        currentVal += val[c];
        continue;
        // We have reached the end of a parameter value, so store it in the map
        // map of parameter assignments along with its corresponding parameter
        // name.
        // If there's an unescaped quote of a different style than the current
        // quote, ignore it for now.
      } else if (currentQuoteStyle == val[c]) {
        currentVal += val[c];
        currentQuoteStyle = "";
        inQuotedString = false;
        assignments[currentKey] = currentVal;
        currentKey = "";
        currentVal = "";
        continue;
      }
    }

    // We're in a quoted string but the quotation hasn't been terminated
    if (!!inQuotedString) {
      currentVal += val[c];
    }

    // We find the start of a parameter name
    if (keyRegexp.test(val[c]) && !inQuotedString && !inKey) {
      inKey = true;
      currentKey += val[c];
      continue;
    }

    // We find part of a parameter name
    if (!!inKey && keyRegexp.test(val[c])) {
      currentKey += val[c];
      continue;
    }

    // We find something that's not a quote or a parameter name, e.g., a space
    // or "!" near the end of input.
    if (!!inKey && !keyRegexp.test(val[c])) {
      inKey = false;
      continue;
    }
  }
  return assignments;
}

// resolveParamValue takes the quoted value of a template variable within a
// partial and returns the unquoted value, resolving any escapes. Escaped
// quotations are resolved within double-quoted strings but not single-quoted
// strings.
//
// Throws an exception if the quotes are mismatched, the input is not wrapped
// in quotes, or the input is empty
export function resolveParamValue(val: string): string {
  if (val == "") {
    throw new Error("the value of a parameter in a partial cannot be empty");
  }
  if (val[0] !== `"` && val[0] !== `'`) {
    throw new Error(
      `parameter values in partials must be wrapped in strings, but this value is not: ${val}`
    );
  }
  if (val[0] !== val[val.length - 1]) {
    throw new Error(
      `parameter values in partials must be wrapped in matching quotes, but this value is not: ${val}`
    );
  }
  let newVal = val.slice(1, val.length - 1);
  if (val[0] == '"') {
    newVal = newVal.replaceAll('\\"', '"');
  }

  return newVal;
}

const resolveIncludes = ({
  value,
  filePath,
  rootDir,
}: ResolveIncludesProps) => {
  let error: string;

  // Assemble an object where keys are the variable keys and values are the var
  // values.
  let vars = {};

  const result = value.replace(includeRegexp, (_, includePath) => {
    includePath = includePath.split(" ")[0];
    const fullImportPath = join(rootDir, includePath);

    if (existsSync(fullImportPath)) {
      let content = readFileSync(fullImportPath, "utf-8");

      const inclusions = value.matchAll(globalIncludeRegexp);
      for (const inclusion of Array.from(inclusions)) {
        const varAssignments = parsePartialParams(inclusion[0]);

        // Replace variables in the partial with their values
        Object.keys(varAssignments).forEach((param) => {
          const val = resolveParamValue(varAssignments[param]);
          const varRegexp = new RegExp(
            `{{ ?${param}(=["'][^"']+["'])? ?}}`,
            "g"
          );
          content = content.replaceAll(varRegexp, val);
        });

        // At this point, we have replaced template variables that were supplied
        // values, so the remainder either have default values or were
        // incorrectly given no value.
        content = content.replace(varDefaultValueRegexp, (_, val) => {
          return val;
        });
      }

      return content;
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

/**
 * correct relative paths resolving in partial docs
 * i.e. start realtive paths from the partial file directory, not from place where it is being inserted
 * example:
 * main file: docs/page/1.mdx
 * partial:   docs/partials/headers/1.mdx
 *
 * With this utility path like that
 * ../image.jpg
 * in partial will be pointing to
 * docs/partials/image.jpg
 * and without:
 * docs/image.jpg
 */
const handlePartialLink = (node: Node, path: string, mdxPath: string) => {
  if (node.type === "link") {
    const href = node.url;

    if (typeof href !== "string" || href[0] === "/" || /^http/.test(href)) {
      return href;
    }
    // root where all documentation pages store
    const absStart = "docs/pages";
    // find an "abs" (starting with root) directory path of the file in which the partial doc was inserted
    const absMdxPath = dirname(absStart + mdxPath.split(absStart).pop());
    const absTargetPath = join(dirname(path), href);
    // make the reference path relative to the place where the partial doc was inserted
    node.url = relative(absMdxPath, absTargetPath);
  }

  if ("children" in node) {
    node.children?.forEach?.((child) =>
      handlePartialLink(child, path, mdxPath)
    );
  }
};

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
                if (path.split(" ")[0].match(/\.mdx?$/)) {
                  const tree = fromMarkdown(result, {
                    extensions: [mdxjs(), gfm(), frontmatter()],
                    mdastExtensions: [
                      mdxFromMarkdown(),
                      gfmFromMarkdown(),
                      frontmatterFromMarkdown(["yaml"]),
                    ],
                  });

                  handlePartialLink(tree, path, vfile.path);

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
