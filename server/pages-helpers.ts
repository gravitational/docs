/*
 * Collection of helpers for gathering metainformation from mdx files.
 */

import type { MDXPage, MDXPageData, MDXPageFrontmatter } from "./types-unist";

import { readSync } from "to-vfile";
import matter from "gray-matter";
import { sep, parse, dirname, resolve, join } from "path";

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

const getEntryForPath = (fs, filePath) => {
  const txt = fs.readFileSync(filePath, "utf8");
  const { data } = matter(txt);
  const slug = filePath.split("docs/pages")[1].replace(".mdx", "/");
  return {
    title: data.title,
    slug: slug,
  };
};

export const generateNavPaths = (fs, dirPath) => {
  const firstLvl = fs.readdirSync(dirPath, "utf8");
  let result = [];
  let firstLvlFiles = new Set();
  let firstLvlDirs = new Set();
  firstLvl.forEach((p) => {
    const fullPath = join(dirPath, p);
    const info = fs.statSync(fullPath);
    if (info.isDirectory()) {
      firstLvlDirs.add(fullPath);
      return;
    }
    firstLvlFiles.add(fullPath);
  });
  let sectionIntros = new Set();
  firstLvlDirs.forEach((d: string) => {
    const { name } = parse(d);
    const asFile = join(d, name + ".mdx");

    if (!fs.existsSync(asFile)) {
      throw `subdirectory in generated sidebar section ${d} has no category page ${asFile}`;
    }
    sectionIntros.add(asFile);
    return;
  });

  // Add files with no corresponding directory to the navigation first. Section
  // introductions, by convention, have a filename that corresponds to the
  // subdirectory containing pages in the section, or have the name
  // "introduction.mdx".
  firstLvlFiles.forEach((f) => {
    result.push(getEntryForPath(fs, f));
  });

  sectionIntros.forEach((si: string) => {
    const { slug, title } = getEntryForPath(fs, si);
    const section = {
      title: title,
      slug: slug,
      entries: [],
    };
    const sectionDir = dirname(si);
    const secondLvl = fs.readdirSync(sectionDir, "utf8");
    secondLvl.forEach((f2) => {
      const { name } = parse(f2);

      // The directory name is the same as the filename, meaning that we have
      // already used this as a category page.
      if (sectionDir.endsWith(name)) {
        return;
      }

      const fullPath2 = join(sectionDir, f2);
      const stat = fs.statSync(fullPath2);
      if (stat.isDirectory()) {
        return;
      }

      section.entries.push(getEntryForPath(fs, fullPath2));
    });
    result.push(section);
  });
  return result;
};
