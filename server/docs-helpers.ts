/*
 * Bunch of helper functions to help with docs generation.
 */

import { Node, Data } from "unist";
import { resolve } from "path";
import { getPathWithoutVersion } from "../utils/url";
import { loadConfig as loadDocsConfig } from "./config-docs";
import { loadConfig as loadSiteConfig } from "./config-site";
import { HeaderMeta } from "components/AnchorNavigation/types";

import type {
  PageMeta,
  RawNavigationItem,
  NavigationItem,
  NavigationCategory,
  ScopesInMeta,
  ComplexScopesConfig,
} from "layouts/DocsPage/types";

import { getStaticPathsForDocs, getDocsPagesMap } from "./paths";
import { getPageInfo } from "./pages-helpers";
import { fetchVideoMeta } from "./youtube-meta";
import getHeaders from "./get-headers";
import { transformToAST } from "./markdown-config";

const { branches, versions, latest } = loadSiteConfig();
const NEXT_PUBLIC_GITHUB_DOCS = process.env.NEXT_PUBLIC_GITHUB_DOCS;

export const getVersion = (filepath: string) => {
  const result = /content\/([^/]+)\/docs\//.exec(filepath);
  return result ? result[1] : "";
};

const getTocDepth = (frontmatterDepth: unknown) => {
  let tocDepth = 2; // default to 2
  if (typeof frontmatterDepth === "number") {
    tocDepth = frontmatterDepth;
  }
  if (typeof frontmatterDepth === "string") {
    const newDepth = parseInt(frontmatterDepth);
    if (!isNaN(newDepth)) {
      tocDepth = newDepth;
    }
  }
  return tocDepth;
};

/**
 * The function is needed to find the corresponding object in the navigation
 * by the passed page path. Since the navigation has a multi-level structure,
 * the function applies recursion
 * @param nav
 * @param pagePath
 * @returns NavigationItem or void
 */
const findNavItem = (
  nav: (NavigationCategory | NavigationItem)[],
  pagePath: string
): NavigationItem | void => {
  for (const navCategory of nav) {
    if ("slug" in navCategory) {
      const slugNoVers = `/${getPathWithoutVersion(navCategory.slug)}`;

      if (
        slugNoVers === pagePath ||
        (slugNoVers === "/" && pagePath === "/index/")
      ) {
        return navCategory;
      }
    }

    if (navCategory.entries) {
      const item = findNavItem(navCategory.entries, pagePath);

      if (item) return item;
    }
  }

  return undefined;
};

function isComplexScopesConfig(smth: string): smth is ComplexScopesConfig {
  return smth.includes(",");
}

type AnyNavItem = RawNavigationItem | NavigationItem;
type AnyNav = NavigationCategory | AnyNavItem;
type CookedNav = NavigationCategory | NavigationItem;

/**
 * Function to add the field `forScopes` to the navigation.
 * If the configurator of the navigation does not specify the scopes
 * in which the current fixture, then all scopes are added.
 * If this page with additional navigation - `forScopes: ["noScope]`.
 * If `forScopes` in navigation string, such string is processed into array.
 *
 */
function addScopesToNavigation(nav: AnyNavItem[]): NavigationItem[];
function addScopesToNavigation(nav: AnyNav[]): CookedNav[];
function addScopesToNavigation(nav: AnyNav[]) {
  const transformedNav: CookedNav[] = [];

  for (let i = 0; i < nav.length; i++) {
    let scopes: ScopesInMeta = ["oss", "enterprise", "cloud"];
    const item = Object.assign({}, nav[i]);

    if ("forScopes" in item) {
      if (typeof item.forScopes === "string") {
        const itemScopes = item.forScopes;

        if (isComplexScopesConfig(itemScopes)) {
          const parsedScopes = itemScopes
            .split(",")
            .map((scope) => scope.trim()) as ScopesInMeta;
          scopes = parsedScopes;
        } else {
          scopes = [itemScopes];
        }
      } else {
        scopes = item.forScopes;
      }
    } else if (item.entries) {
      scopes = ["noScope"];

      item.entries = addScopesToNavigation(item.entries);
    }

    transformedNav.push({ ...item, forScopes: scopes });
  }

  return transformedNav;
}

/**
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

/**
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
  const navigationWithScopes = addScopesToNavigation(navigation);
  let pagePath = path.split("pages")[1];
  let scopes: ScopesInMeta = [""];

  if (pagePath.includes(".mdx")) {
    pagePath = pagePath.replace(".mdx", "/");
  }

  const navigationItem = findNavItem(navigationWithScopes, pagePath);

  if (navigationItem && navigationItem.forScopes) {
    scopes = navigationItem.forScopes;
  }

  return {
    navigation: navigationWithScopes,
    githubUrl,
    versions: {
      current,
      latest,
      available: versions,
    },
    scopes,
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

export interface DocsPageProps {
  meta: PageMeta;
  tableOfContents: HeaderMeta[];
  AST: Node<Data>;
}

export const getDocsPageProps = async (
  slug: string
): Promise<DocsPageProps> => {
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

  // Transforms page text page to AST
  const AST = await transformToAST(page.data.content, page);

  //If we set 'toc-depth' in page metadata, import the value here for the ToC to use
  const tocDepth = getTocDepth(page.data.frontmatter.tocDepth);

  // Generates ToC from the headers in the AST
  const tableOfContents = getHeaders(AST, tocDepth);

  return {
    meta: { ...page.data.frontmatter, ...pageMeta } as PageMeta,
    AST,
    tableOfContents,
  };
};
