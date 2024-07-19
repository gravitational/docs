import * as nodeFS from "fs";
import path from "path";
import matter from "gray-matter";
import { visitParents } from "unist-util-visit-parents";
import { fromMarkdown } from "mdast-util-from-markdown";
import type { Parent } from "unist";
import type { VFile } from "vfile";
import type { Content } from "mdast";
import type { Transformer } from "unified";

// relativePathToFile takes a filepath and returns a path we can use in links
// to the file in a table of contents page. The link path is a relative path
// to the directory where we are placing the table of contents page.
// @param root {string} - the directory path to the table of contents page.
// @param filepath {string} - the path from which to generate a link path.
const relativePathToFile = (root: string, filepath: string) => {
  // Return the filepath without the first segment, removing the first
  // slash. This is because the TOC file we are generating is located at
  // root.
  return filepath.slice(root.length).replace(/^\//, "");
};

// getTOC generates a list of links to all files in the same directory as
// filePath except for filePath. The return value is an object with two
// properties:
// - result: a string containing the resulting list of links.
// - error: an error message encountered during processing
export const getTOC = (filePath: string, fs: any = nodeFS) => {
  const dirPath = path.dirname(filePath);
  if (!fs.existsSync(dirPath)) {
    return {
      error: `Cannot generate a table of contents for nonexistent directory at ${dirPath}`,
    };
  }

  const { name } = path.parse(filePath);

  const files = fs.readdirSync(dirPath, "utf8");
  let mdxFiles = new Set();
  const dirs = files.reduce((accum, current) => {
    // Don't add a TOC entry for the current file.
    if (name == path.parse(current).name) {
      return accum;
    }
    const stats = fs.statSync(path.join(dirPath, current));
    if (!stats.isDirectory() && current.endsWith(".mdx")) {
      mdxFiles.add(path.join(dirPath, current));
      return accum;
    }
    accum.add(path.join(dirPath, current));
    return accum;
  }, new Set());

  // Add rows to the menu page for non-menu pages.
  const entries = [];
  mdxFiles.forEach((f: string, idx: number) => {
    const text = fs.readFileSync(f, "utf8");
    let relPath = relativePathToFile(dirPath, f);
    const { data } = matter(text);
    entries.push(`- [${data.title}](${relPath}): ${data.description}`);
  });

  // Add rows to the menu page for first-level child menu pages
  dirs.forEach((f: string, idx: number) => {
    const menuPath = path.join(f, path.parse(f).base + ".mdx");
    if (!fs.existsSync(menuPath)) {
      return {
        error: `there must be a page called ${menuPath} that introduces ${f}`,
      };
    }
    const text = fs.readFileSync(menuPath, "utf8");
    let relPath = relativePathToFile(dirPath, menuPath);
    const { data } = matter(text);

    entries.push(`- [${data.title}](${relPath}): ${data.description}`);
  });
  entries.sort();
  return { result: entries.join("\n") };
};

const tocRegexpPattern = "^\\(!toc!\\)$";

// remarkTOC replaces (!toc!) syntax in a page with a list of docs pages at a
// given directory location.
export default function remarkTOC(): Transformer {
  return (root: Content, vfile: VFile) => {
    const lastErrorIndex = vfile.messages.length;

    visitParents(root, (node, ancestors: Parent[]) => {
      if (node.type !== "text") {
        return;
      }
      const parent = ancestors[ancestors.length - 1];

      if (parent.type !== "paragraph") {
        return;
      }
      if (!parent.children || parent.children.length !== 1) {
        return;
      }

      const tocExpr = node.value.trim().match(tocRegexpPattern);
      if (!tocExpr) {
        return;
      }

      const { result, error } = getTOC(vfile.path);
      if (!!error) {
        vfile.message(error, node);
        return;
      }
      const tree = fromMarkdown(result, {});

      const grandParent = ancestors[ancestors.length - 2] as Parent;
      const parentIndex = grandParent.children.indexOf(parent);

      grandParent.children.splice(parentIndex, 1, ...tree.children);
    });
  };
}
