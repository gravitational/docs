/*
 * List of plugins used on the docs pages. Not merged with main config
 * because we have some plugins that only work with
 * content of `/content/X.X/docs/` folders.
 */

import type { VFile } from "vfile";

import { resolve } from "path";
import { unified } from "unified";
import rehypeMdxToHast from "./rehype-mdx-to-hast";
import remarkMDX from "remark-mdx";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGFM from "remark-gfm";
import remarkIncludes from "./remark-includes";
import remarkLinks from "./remark-links";
import remarkVariables from "./remark-variables";
import remarkCodeSnippet from "./remark-code-snippet";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkCopyLinkedFiles from "remark-copy-linked-files";
import rehypeImages from "./rehype-images";
import { getVersion, getVersionRootPath } from "./docs-helpers";
import { loadConfig } from "./config-docs";

const staticPath = "/docs/_next/static/assets/";
const destinationDir = resolve(`.next/static/assets`);

export const transformToAST = async (value: string, vfile: VFile) => {
  const ast = unified()
    .use(remarkParse)
    .use(remarkMDX)
    .use(remarkGFM)
    .parse(value);

  const AST = await unified()
    .use(remarkMDX)
    .use(remarkGFM)
    .use(remarkIncludes, {
      rootDir: getVersionRootPath(vfile.path),
    }) // Resolves (!include.ext!) syntax
    .use(remarkVariables, {
      variables: loadConfig(getVersion(vfile.path)).variables || {},
    }) // Resolves (=variable=) syntax
    .use(remarkCodeSnippet, {
      langs: ["code"],
    })
    .use(remarkLinks)
    .use(remarkCopyLinkedFiles, {
      destinationDir,
      staticPath,
      ignoreFileExtensions: [".md", ".mdx"],
    })
    .use(remarkRehype, {
      allowDangerousHtml: true,
      passThrough: [
        "mdxFlowExpression",
        "mdxJsxFlowElement",
        "mdxJsxTextElement",
        "mdxTextExpression",
        "mdxjsEsm",
      ],
    })
    .use(rehypeSlug)
    .use(rehypeHighlight, {
      aliases: {
        bash: ["bsh", "systemd", "code", "powershell"],
        yaml: ["conf", "toml"],
      },
    })
    .use(rehypeMdxToHast)
    .use(rehypeImages, {
      destinationDir,
      staticPath,
    })
    .run(ast, vfile);

  return AST;
};
