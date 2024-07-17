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

// getEntryForPath returns a navigation item for the file at filePath in the
// given filesystem.
const getEntryForPath = (fs, filePath) => {
  const txt = fs.readFileSync(filePath, "utf8");
  const { data } = matter(txt);
  const slug = filePath.split("docs/pages")[1].replace(".mdx", "/");
  return {
    title: data.title,
    slug: slug,
  };
};

// sortByTitle takes two navigation entries, a and b, and sorts them in
// alphabetically ascending order by their "title" field. If either title
// includes the substring "introduction", sortByTitle sorts that entry first.
const sortByTitle = (a, b) => {
  switch (true) {
    case a.title.toLowerCase().includes("introduction"):
      return -1;
      break;
    case b.title.toLowerCase().includes("introduction"):
      return 1;
      break;
    default:
      return a.title < b.title ? -1 : 1;
  }
};

// categoryPagePathForDir looks for a category page at the same directory level
// as its associated directory OR within the associated directory. Throws an
// error if there is no category page for the directory.
const categoryPagePathForDir = (fs, dirPath) => {
  const { name } = parse(dirPath);

  const outerCategoryPage = join(dirname(dirPath), name + ".mdx");
  const innerCategoryPage = join(dirPath, name + ".mdx");

  if (fs.existsSync(outerCategoryPage)) {
    return outerCategoryPage;
  }
  if (fs.existsSync(innerCategoryPage)) {
    return innerCategoryPage;
  }
  throw new Error(
    `subdirectory in generated sidebar section ${dirPath} has no category page ${innerCategoryPage} or ${outerCategoryPage}`
  );
};

export const navEntriesForDir = (fs, dirPath) => {
  const firstLvl = fs.readdirSync(dirPath, "utf8");
  let result = [];
  let firstLvlFiles = new Set();
  let firstLvlDirs = new Set();

  // Sort the contents of dirPath into files and directoreis.
  firstLvl.forEach((p) => {
    const fullPath = join(dirPath, p);
    const info = fs.statSync(fullPath);
    if (info.isDirectory()) {
      firstLvlDirs.add(fullPath);
      return;
    }
    firstLvlFiles.add(fullPath);
  });

  // Map category pages to the directories they introduce so we can can add a
  // sidebar entry for each category page, then traverse each directory to add
  // further sidebar pages.
  let sectionIntros = new Map();
  firstLvlDirs.forEach((d: string) => {
    sectionIntros.set(categoryPagePathForDir(fs, d), d);
  });

  // Add files with no corresponding directory to the navigation first. Section
  // introductions, by convention, have a filename that corresponds to the
  // subdirectory containing pages in the section, or have the name
  // "introduction.mdx".
  firstLvlFiles.forEach((f: string) => {
    // Handle section intros separately
    if (sectionIntros.has(f)) {
      return;
    }
    if (!f.endsWith(".mdx")) {
      return;
    }
    result.push(getEntryForPath(fs, f));
  });

  // Add a category page for each section intro, then traverse the contents of
  // the directory that the category page introduces, adding the contents to
  // entries.
  sectionIntros.forEach((dirPath, categoryPagePath) => {
    const { slug, title } = getEntryForPath(fs, categoryPagePath);
    const section = {
      title: title,
      slug: slug,
      entries: [],
    };

    section.entries = navEntriesForDir(fs, dirPath);
    result.push(section);
  });
  result.sort(sortByTitle);
  return result;
};

export const generateNavPaths = (fs, dirPath) => {
  const firstLvl = fs.readdirSync(dirPath, "utf8");
  let result = [];
  let firstLvlFiles = new Set();
  let firstLvlDirs = new Set();

  // Sort the contents of dirPath into files and directoreis.
  firstLvl.forEach((p) => {
    const fullPath = join(dirPath, p);
    const info = fs.statSync(fullPath);
    if (info.isDirectory()) {
      firstLvlDirs.add(fullPath);
      return;
    }
    firstLvlFiles.add(fullPath);
  });

  // Map category pages to the directories they introduce so we can can add a
  // sidebar entry for each category page, then traverse each directory to add
  // further sidebar pages.
  let sectionIntros = new Map();
  firstLvlDirs.forEach((d: string) => {
    sectionIntros.set(categoryPagePathForDir(fs, d), d);
  });

  // Add files with no corresponding directory to the navigation first. Section
  // introductions, by convention, have a filename that corresponds to the
  // subdirectory containing pages in the section, or have the name
  // "introduction.mdx".
  firstLvlFiles.forEach((f: string) => {
    // Handle section intros separately
    if (sectionIntros.has(f)) {
      return;
    }
    if (!f.endsWith(".mdx")) {
      return;
    }
    result.push(getEntryForPath(fs, f));
  });

  // Add a category page for each section intro, then traverse the contents of
  // the directory that the category page introduces, adding the contents to
  // entries.
  sectionIntros.forEach((dirPath, categoryPagePath) => {
    const { slug, title } = getEntryForPath(fs, categoryPagePath);
    const section = {
      title: title,
      slug: slug,
      entries: [],
    };

    // TODO: From this point, we can probably make this recursive (remove
    // everything below here and assign entries to another call of the
    // recursive function).
    const secondLvl = new Set(fs.readdirSync(dirPath, "utf8"));

    // Find all second-level category pages first so we don't
    // repeat them in the sidebar.
    secondLvl.forEach((f2: string) => {
      let fullPath2 = join(dirPath, f2);
      const stat = fs.statSync(fullPath2);

      // List category pages on the second level, but not their contents.
      if (!stat.isDirectory()) {
        return;
      }
      const catPath = categoryPagePathForDir(fs, fullPath2);
      fullPath2 = catPath;
      secondLvl.delete(f2);

      // Delete the category page from the set so we don't add it again
      // when we add individual files.
      secondLvl.delete(parse(catPath).base);
      section.entries.push(getEntryForPath(fs, fullPath2));
    });

    secondLvl.forEach((f2: string) => {
      // Only add entries for MDX files here
      if (!f2.endsWith(".mdx")) {
        return;
      }

      let fullPath2 = join(dirPath, f2);

      // This is a first-level category page that happens to exist on the second
      // level.
      if (sectionIntros.has(fullPath2)) {
        return;
      }

      const stat = fs.statSync(fullPath2);
      section.entries.push(getEntryForPath(fs, fullPath2));
    });

    section.entries.sort(sortByTitle);
    result.push(section);
  });
  result.sort(sortByTitle);
  return result;
};
