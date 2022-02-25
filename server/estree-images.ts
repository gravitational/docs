import type { Property, Literal, Identifier, ObjectExpression } from "estree";
import type { Node } from "acorn";

import { resolve, dirname } from "path";
import { existsSync } from "fs";
import { simple, base } from "acorn-walk";
import { isLocalAssetFile } from "../utils/url";

/*
 * Given an estree of an object, will check if
 * the object props name in included in the propsList,
 * have a file name inside, this file exists,
 * its extension is in extWhiteList and not,
 * in extBlackList.
 *
 * Used mostly for finiding asset filenames in frontmatter and replacing them
 * with imports.
 *
 * E. g. config like this:
 *
 * {
 *   propsList: ["src", "href", "poster", "image"],
 *   extWhiteList: [],
 *   extBlackList: ["mdx", "md", "css", "ts", "tsx", "js", "jsx"],
 * }
 *
 * Will return field named "image" from frontmatter if it includes path to existing
 * file with the extension "png", but not with extension "js".
 */

interface VisitImagePathsParams {
  tree: Node;
  path: string;
  callback: (node: Literal) => Literal | ObjectExpression;
  propsList?: string[];
  extWhiteList: string[];
  extBlackList: string[];
}

export const visitImagePaths = ({
  tree,
  path,
  callback,
  propsList,
  extWhiteList,
  extBlackList,
}: VisitImagePathsParams) => {
  simple(
    tree,
    {
      Property(baseNode) {
        const node = baseNode as unknown as Property;

        if (
          node.value.type === "Literal" &&
          (propsList
            ? propsList.includes((node.key as Identifier).name)
            : true) &&
          isLocalAssetFile(node.value.value as string, {
            extWhiteList,
            extBlackList,
          }) &&
          existsSync(resolve(dirname(path), node.value.value as string))
        ) {
          node.value = callback(node.value);
        }
      },
    },
    {
      ...base,
      JSXElement: () => undefined,
    }
  );
};
