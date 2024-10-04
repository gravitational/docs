import type { Root, RootContent } from "mdast";
import type { VFile } from "vfile";
import { resolve, relative, dirname } from "path";
import { getCurrentVersion, getLatestVersion } from "./config-site";
import { isLocalAssetFile } from "../src/utils/url";

const current = getCurrentVersion();
const latest = getLatestVersion();

const REGEXP_VERSION = /^\/versioned_docs\/version-([^\/]+)\//;
const REGEXP_EXTENSION = /(\/index)?\.mdx$/;

export type DocsMeta = {
  isCurrent: boolean;
  isLatest: boolean;
  isIndex: boolean;
  slug: string;
  version: string;
  rootDir: string;
  assetsDir: string;
  currentDir: string;
  pagesDir: string;
  originalPath: string;
};

const getProjectPath = (vfile: VFile) => vfile.path.replace(process.cwd(), "");

const isCurrent = (vfile: VFile) => getProjectPath(vfile).startsWith("/docs/");

export const getVersionFromVFile = (vfile: VFile): string => {
  return isCurrent(vfile)
    ? current
    : REGEXP_VERSION.exec(getProjectPath(vfile))[1];
};

export const getRootDir = (vfile: VFile): string => {
  return resolve("content", getVersionFromVFile(vfile));
};

const getCurrentDir = (vfile: VFile) =>
  isCurrent(vfile)
    ? resolve("docs")
    : resolve(`versioned_docs/version-${getVersionFromVFile(vfile)}`);

const getPagesDir = (vfile: VFile): string =>
  resolve(getRootDir(vfile), "docs/pages");

const getOriginalPath = (vfile: VFile) =>
  vfile.path.replace(getCurrentDir(vfile), getPagesDir(vfile));

const extBlackList = ["md", "mdx"];

export const updateAssetPath = (href: string, { vfile }: { vfile: VFile }) => {
  if (isLocalAssetFile(href, { extBlackList })) {
    const assetPath = resolve(dirname(getOriginalPath(vfile)), href);

    return relative(dirname(vfile.path), assetPath);
  }

  if (href.includes("#")) {
    return href.toLowerCase();
  }

  return href;
};

/**
 * correct relative paths resolving in partial docs
 * i.e. start realtive paths from the partial file directory, not from place where it is being inserted
 * example:
 * main file: docs/page/1.mdx
 * partial:   docs/partials/headers/1.mdx
 *
 * With this utility path like that
 * ../image.jpg
 * in partial will be pointing to
 * docs/partials/image.jpg
 * and without:
 * docs/image.jpg
 */

export const updatePathsInIncludes = ({
  node,
  versionRootDir,
  includePath,
  vfile,
}: {
  node: Root | RootContent;
  versionRootDir: string;
  includePath: string;
  vfile: VFile;
}) => {
  if (
    node.type === "image" ||
    node.type === "link" ||
    node.type === "definition"
  ) {
    const href = node.url;

    // Ignore non-strings, absolute paths, web URLs, and links consisting only
    // of anchors (these will end up pointing to the containing page).
    if (
      typeof href !== "string" ||
      href[0] === "/" ||
      /^http/.test(href) ||
      href[0] === "#"
    ) {
      return href;
    }

    if (node.type === "link") {
      const absMdxPath = dirname(vfile.path);

      const absTargetPath = resolve(
        versionRootDir,
        dirname(includePath),
        href
      ).replace(getPagesDir(vfile), getCurrentDir(vfile));

      node.url = relative(absMdxPath, absTargetPath);
    } else {
      const absMdxPath = resolve(getOriginalPath(vfile));

      const absTargetPath = resolve(versionRootDir, dirname(includePath), href);

      node.url = relative(dirname(absMdxPath), absTargetPath);
    }
  }

  if ("children" in node) {
    node.children?.forEach?.((child) =>
      updatePathsInIncludes({ node: child, versionRootDir, includePath, vfile })
    );
  }
};
