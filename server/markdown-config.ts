/*
 * List of plugins used on the docs pages. Not merged with main config
 * because we have some plugins that only work with
 * content of `/content/X.X/docs/` folders.
 */

import type { VFile } from "vfile";
import type { PluggableList } from "unified";

import rehypeHeaders from "./rehype-headers";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkGFM from "remark-gfm";
import remarkIncludes from "./remark-includes";
import remarkLayout from "./remark-layout";
import remarkLinks from "./remark-links";
import remarkVariables from "./remark-variables";
import remarkMdxDisableExplicitJsx from "remark-mdx-disable-explicit-jsx";
import remarkCodeSnippet from "./remark-code-snippet";
import remarkImportFiles from "./remark-import-files";
import { getVersion, getVersionRootPath } from "./docs-helpers";
import { loadConfig } from "./config-docs";
import { fetchVideoMeta } from "./youtube-meta";
import { getPageMeta } from "./docs-helpers";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import rehypeRaw from "rehype-raw";

export const transformToAST = (value: string) => {
  const ast = unified().use(remarkParse).parse(value);

  return unified()
    .use(remarkLinks)
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
