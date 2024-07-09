/*
 * List of plugins and settings for them used on the docs pages.
 */

import type { VFile } from "vfile";

import { resolve } from "path";
import { unified } from "unified";
import rehypeMdxToHast from "./rehype-mdx-to-hast";
import remarkMDX from "remark-mdx";
import rehypeSlug from "rehype-slug";
import remarkGFM from "remark-gfm";
import remarkIncludes from "./remark-includes";
import remarkLinks from "./remark-links";
import remarkVariables from "./remark-variables";
import remarkCodeSnippet from "./remark-code-snippet";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkTOC from "./remark-toc";
import remarkCopyLinkedFiles from "remark-copy-linked-files";
import rehypeImages from "./rehype-images";
import { getVersion, getVersionRootPath } from "./docs-helpers";
import { loadConfig } from "./config-docs";
import { codeLangs } from "./code-langs";
import { definer as hcl } from "highlightjs-terraform";
import { rehypeVarInHLJS } from "./rehype-hljs-var";

// We move images to `.next/static` because this folder is preserved
// in the cache on rebuilds. If we place them in `public` folder, they will
// be lost on subsequent builds.
const destinationDir = resolve(`.next/static/assets`);
const staticPath = "/docs/_next/static/assets/";
const configFilePath = resolve("mermaid.json");

export const transformToAST = async (value: string, vfile: VFile) => {
  // parse() will parse original file, but not apply plugins. But because
  // MDX and GFM are extending parser we need to add them here.
  const ast = unified()
    .use(remarkParse)
    .use(remarkMDX) // Will add mdx parser
    .use(remarkGFM) // Will add tables parser
    .parse(value);

  // run() will apply plugins and return modified AST
  const AST = await unified()
    // Resolves (!toc dir/path!) syntax
    .use(remarkTOC)
    .use(remarkIncludes, {
      rootDir: getVersionRootPath(vfile.path),
    }) // Resolves (!include.ext!) syntax
    .use(remarkVariables, {
      variables: loadConfig(getVersion(vfile.path)).variables || {},
    }) // Resolves (=variable=) syntax
    .use(remarkCodeSnippet, {
      langs: codeLangs,
    }) // Adds custom code snippets
    .use(remarkLinks) // Makes links absolute and removes mdx extension
    .use(remarkCopyLinkedFiles, {
      destinationDir,
      staticPath,
      ignoreFileExtensions: [".md", ".mdx"],
    }) // Copies images and files to public folder and updates links
    .use(remarkRehype, {
      passThrough: [
        "mdxFlowExpression",
        "mdxJsxFlowElement",
        "mdxJsxTextElement",
        "mdxTextExpression",
        "mdxjsEsm",
      ], // passThrough options says transformer which nodes to leave as is
    }) // Transforms remark to rehype
    .use(rehypeSlug) // Add IDs to headers
    .use(rehypeVarInHLJS, {
      aliases: {
        bash: ["bsh", "systemd", "code", "powershell"],
        yaml: ["conf", "toml"],
      },
      languages: { hcl: hcl },
    }) // Adds syntax highlighting
    .use(rehypeMdxToHast)
    .use(rehypeImages, {
      destinationDir,
      staticPath,
    }) // Adds sizes to the images
    .run(ast, vfile);

  return AST;
};
