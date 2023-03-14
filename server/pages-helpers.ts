/*
 * Collection of helpers for gathering metainformation from mdx files.
 */

import type { MDXPage, MDXPageData, MDXPageFrontmatter } from "./types-unist";

import { resolve } from "path";
import { readSync } from "to-vfile";
import matter from "gray-matter";

export const extensions = ["md", "mdx", "ts", "tsx", "js", "jsx"];

export const pagesRoot = resolve("pages");

/*
 * Returns public uri that the files in "pages" folder will have on prod.
 *
 * Does NOT normaize current versions for docs.
 */

export const getURIFromPath = (path: string): string => {
  return path
    .replace(pagesRoot, "")
    .replace(new RegExp(`(/index)?.(${extensions.join("|")})$`), "/");
};

/* Next build happens in the single process so we can cache file data */

const cache: Record<string, MDXPage> = {};

/*
 * Returns VFile for the mdx file in "pages" with parsed frontmatter and public uri.
 *
 * Tip: Replace T with correct frontmatter structure for the page type
 * then executing for better autosuggerst and error handling
 */

export const getPageInfo = <T = MDXPageFrontmatter>(
  path: string
): MDXPage<T> => {
  let result;

  if (process.env.NODE_ENV === "production") {
    result = cache[path] as MDXPage<T>;
  }

  if (!result) {
    const file = readSync(path, "utf-8") as MDXPage<T>;

    const { data, content } = matter(file.value);

    file.data = {
      frontmatter: data,
      content,
      uri: getURIFromPath(path),
    } as MDXPageData<T>;

    result = file;
    cache[path] = result as MDXPage<MDXPageFrontmatter>;
  }

  return result;
};
