/*
 * Bunch of helper functions to help with docs generation.
 */

import { resolve } from "path";
import { loadConfig as loadDocsConfig } from "./config-docs";
import { loadConfig as loadSiteConfig } from "./config-site";
import { getStaticPathsForDocs, getDocsPagesMap } from "./paths";
import { getPageInfo } from "./pages-helpers";
import { fetchVideoMeta } from "./youtube-meta";
import getHeaders from "./get-headers";
import { transformToAST } from "./markdown-config";

const { branches, versions, latest } = loadSiteConfig();
const { NEXT_PUBLIC_GITHUB_DOCS } = process.env;

export const getVersion = (filepath: string) => {
  const result = /content\/([^/]+)\/docs\//.exec(filepath);
  return result ? result[1] : "";
};

/*
 * Used by some remark plugins to resolve paths to assets based on the
 * current docs folders. E. g. remark-includes.
 */

export const getVersionRootPath = (filepath: string) => {
  const version = getVersion(filepath);

  if (version) {
    return resolve(`content/${version}`);
  } else {
    // CI task for linting stored files in the root of the content folder
    return resolve("content");
  }
};

/*
 * Generates link to use in "Improve" button on the docs pages.
 */

export const getGithubURL = (filepath: string) => {
  const current = getVersion(filepath);
  const root = getVersionRootPath(filepath);
  const ghIssuePath = `${NEXT_PUBLIC_GITHUB_DOCS}/issues/new?labels=documentation&template=documentation.md`;

  return branches[current]
    ? `${ghIssuePath}&title=[v.${current}]%20${filepath.replace(root, "")}`
    : ghIssuePath;
};

/*
 * Generates props for docs page, based on the page location in the FS.
 */

export const getPageMeta = (path: string) => {
  const current = getVersion(path);
  const { navigation } = loadDocsConfig(current);

  const githubUrl = getGithubURL(path);

  return {
    navigation,
    githubUrl,
    versions: {
      current,
      latest,
      available: versions,
    },
  };
};

/*
 * Generate and return props for each docs page. For production it will use
 * cached results, for dev mode it will regenerate them each time.
 */

const cachedGetStaticPathsForDocs = getStaticPathsForDocs();

export const getDocsPaths = () => {
  if (process.env.NODE_ENV === "production") {
    return cachedGetStaticPathsForDocs;
  } else {
    return getStaticPathsForDocs();
  }
};

/*
 * Generates and return a map of the slugs and filenames. For production it will use
 * cached results, for dev mode it will regenerate them each time.
 */

const cachedPagesMap = getDocsPagesMap();

const getPagesMap = () => {
  if (process.env.NODE_ENV === "production") {
    return cachedPagesMap;
  } else {
    return getDocsPagesMap();
  }
};

/*
 * Returns props for the docs page.
 */

export const getDocsPageProps = async (slug: string) => {
  const filepath = getPagesMap()[slug];

  // Read vfile with parsed frontmatter
  const page = getPageInfo(filepath);

  // Adds versions, navigation, githubUrl, etc.
  const pageMeta = getPageMeta(filepath);

  // If we have videoBanner file in config, we load this vide data through YouTube API.
  const { videoBanner } = page.data.frontmatter;

  if (typeof videoBanner === "string") {
    page.data.frontmatter.videoBanner = await fetchVideoMeta(videoBanner);
  }

  // Transforms page text page to ASK while applying bunch of plugins
  const AST = await transformToAST(page.data.content, page);

  // Generates ToC from the headers in the AST
  const tableOfConents = getHeaders(AST);

  return {
    meta: { ...page.data.frontmatter, ...pageMeta },
    AST,
    tableOfConents,
  };
};
