import { lintRule } from "unified-lint-rule";
import { visit } from "unist-util-visit";
import type { VFile } from "vfile";
import type { Position, Node, Parent } from "unist";
import {
  MdxJsxFlowElement,
  ProgramEsmNode,
  MdxJsxAttributeValue,
} from "./types-unist";

// Matches, for example, "team" and "oss" in:
// '{["team", "oss"]}'
// Used to find scope values in un-executed TS strings used as the values of
// properties in MDAST nodes.
const wordPattern = "(^|\\W)(\\w+)($|\\W)";

const parseScopeValue = (val: MdxJsxAttributeValue): string[] => {
  let scopeExpr: string;

  if (typeof val === "string") {
    scopeExpr = val;
  } else {
    scopeExpr = (val as ProgramEsmNode).value;
  }
  const matches = scopeExpr.matchAll(new RegExp(wordPattern, "gm"));
  if (matches === null) {
    return [];
  }
  return Array.from(matches).map((match) => {
    // The second capture group
    return match[2];
  });
};

export const remarkLintScopes = lintRule(
  "remark-lint:scopes",
  (
    root: Parent,
    file: VFile,
    getscopes: string[] | ((vfile: VFile) => string[])
  ) => {
    let scopes: string[];

    if (typeof getscopes === "function") {
      scopes = getscopes(file);
    } else {
      scopes = getscopes;
    }

    visit(root, (node: MdxJsxFlowElement) => {
      if (
        // JSX components. See:
        // https://github.com/syntax-tree/mdast-util-mdx-jsx#mdxjsxflowelement-1
        node.type === "mdxJsxFlowElement" &&
        node.hasOwnProperty("attributes")
      ) {
        (node as MdxJsxFlowElement).attributes.forEach(({ name, value }) => {
          if (name !== "scope" || !value) {
            return;
          }
          const componentScopes = parseScopeValue(value);
          const configuredScopeSet = new Set(scopes);
          const componentScopeSet = new Set(componentScopes);
          const excessScopes = componentScopes.filter((el) => {
            return !configuredScopeSet.has(el);
          });

          excessScopes.forEach((el) => {
            file.message(
              `The page is configured for scopes "${scopes.join(
                ","
              )}", but the ${
                node.name
              } component supports the "${el}" scope. Either fix the ${
                node.name
              } component or adjust the forScopes setting for the page in docs/config.json.`,
              node.position
            );
          });
        });

        if (node.name === "Tabs") {
          let tabScopes = new Set([]);

          // Collect the scopes within all TabItems of a Tabs component and
          // ensure that they include all scopes configured for a page.
          node.children.forEach((child) => {
            if ((child as MdxJsxFlowElement).name !== "TabItem") {
              return;
            }
            (child as MdxJsxFlowElement).attributes.forEach(
              ({ name, value }) => {
                if (name !== "scope" || !value) {
                  return;
                }
                parseScopeValue(value).forEach((scope) => {
                  tabScopes.add(scope);
                });
              }
            );
          });

          // This is not a scoped Tabs component, so don't check the scopes.
          if (Array.from(tabScopes).length === 0) {
            return;
          }

          const missingScopes = scopes.filter((el) => {
            return !tabScopes.has(el);
          });

          missingScopes.forEach((el) => {
            file.message(
              `The page is configured for scopes "${scopes.join(
                ","
              )}", but the "${el}" scope is missing from a ${
                node.name
              } component. Either fix the ${
                node.name
              } component or adjust the forScopes setting for the page in docs/config.json.`,
              node.position
            );
          });
        }
      }
    });
  }
);
