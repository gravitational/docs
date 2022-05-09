/*
 * List of plugins used on the docs pages. Not merged with main config
 * because we have some plugins that only work with
 * content of `/content/X.X/docs/` folders.
 */

import type { VFile } from "vfile";

import rehypeHeaders from "./rehype-headers";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGFM from "remark-gfm";
import remarkIncludes from "./remark-includes";
import remarkLinks from "./remark-links";
import remarkVariables from "./remark-variables";
import remarkCodeSnippet from "./remark-code-snippet";
import { getVersion, getVersionRootPath } from "./docs-helpers";
import { loadConfig } from "./config-docs";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import rehypeRaw from "rehype-raw";

export const transformToAST = (value: string, vfile: VFile) => {
  const ast = unified().use(remarkParse).parse(value);

  return unified()
    .use(remarkLinks)
    .use(remarkGFM)
    .use(remarkIncludes, {
      rootDir: getVersionRootPath(vfile.path),
    }) // Resolves (!include.ext!) syntax
    .use(remarkVariables, {
      variables: loadConfig(getVersion(vfile.path)).variables || {},
    }) // Resolves (=variable=) syntax
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeHighlight, {
      aliases: {
        bash: ["bsh", "systemd", "code", "powershell"],
        yaml: ["conf", "toml"],
      },
    })
    .runSync(ast);
};
