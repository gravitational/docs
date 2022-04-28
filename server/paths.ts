import glob from "glob";
import { resolve, join } from "path";
import { writeFileSync } from "fs";
import { loadConfig as loadDocsConfig } from "./config-docs";
import { loadConfig as loadSiteConfig } from "./config-site";
import { generateSitemap as sitemapGenerator } from "./sitemap";
import { getPageInfo } from "./pages-helpers";

const { latest, versions } = loadSiteConfig();

/*
 * Excludes mdx pages with "noindex" in frontmatter from sitemap
 */

const filterNoIndexPage = (path: string) => {
  const isMdxPage = /\.mdx?$/.test(path);

  if (!isMdxPage) {
    return true;
  }

  const { data } = getPageInfo<{ noindex?: boolean }>(path);

  const { frontmatter } = data;

  return !frontmatter.noindex;
};

/*
 * Converts paths to absolute from relative (we need sitemaps to have absolute paths).
 */

const normalizeDocSlug = (slug: string, version: string) => {
  const root = join("/ver", version);
  const path = resolve("content", version, "docs/pages");
  const isLatest = version === latest;
  const baseSlug = slug.replace(/\/?(index)?.mdx?$/, "/").replace(path, root);

  return isLatest ? baseSlug.replace(`/ver/${latest}`, "") : baseSlug;
};

const getFilePathsForVersion = (
  version: string,
  withNoIndex: boolean = false
) => {
  const path = resolve("content", version, "docs/pages");

  return glob
    .sync(join(path, "**/*.mdx"))
    .filter((path) => (withNoIndex ? true : filterNoIndexPage(path)))
    .filter((path) => !path.includes("/includes/"));
};

/*
 * Returns all slugs for one docs version with normalized paths.
 */

const getSlugsForVersion = (version: string, withNoIndex: boolean = false) => {
  return getFilePathsForVersion(version, withNoIndex).map((slug) =>
    normalizeDocSlug(slug, version)
  );
};

/*
 * Generates sitemap used by search engines.
 * Only have paths for current version of docs.
 */

export const generateSitemap = (root: string) => {
  const currentDocPages = getSlugsForVersion(latest).map((slug) => ({
    loc: slug,
  }));

  sitemapGenerator({
    pages: [...currentDocPages],
    path: resolve("public", "sitemap.xml"),
    root,
  });
};

/*
 * Generates sitemap used by Algolia indexer.
 * Have paths for all versions of docs and no other pages.
 */

export const generateFullSitemap = (root: string) => {
  const docPages = [];

  versions.forEach((version) => {
    docPages.push(
      ...getSlugsForVersion(version).map((slug) => ({
        loc: slug,
      }))
    );
  });

  sitemapGenerator({
    pages: docPages,
    path: resolve("public", "algolia_sitemap.xml"),
    root,
  });
};

/*
 * Get params for the getStaticPaths in Next.js
 */

export const getStaticPathsForDocs = () => {
  const result = [];

  versions.forEach((version) => {
    result.push(
      ...getSlugsForVersion(version).map((path) => {
        const slug = path.split("/").filter((part) => part);

        return {
          params: slug.length ? { slug } : { slug: undefined },
        };
      })
    );
  });

  return result;
};

export const getDocsPagesMap = () => {
  const result = {};

  versions.forEach((version) => {
    const paths = getFilePathsForVersion(version, true);

    paths.forEach((path) => {
      result[normalizeDocSlug(path, version)] = path;
    });
  });

  return result;
};

/*
 * Each version of docs has its own set of redirects in their config.json files.
 * Here we load and merge them all with the redirects list from the main config.json.
 */

export const getRedirects = () => {
  const result = versions.flatMap((version) => {
    const config = loadDocsConfig(version);

    return config.redirects ? config.redirects : [];
  });

  return result;
};

//The file has the following structure
/*[
  ...,
  "6.2": [
    {
      path: string;
      foundedConfigRedirect?: string
    }, ...
  ],
  "7.0": [
    {
      path: string;
      foundedConfigRedirect?: string
    }, ...
  ],
  ...
]
*/

export const generateArticleLinks = () => {
  const map = {};

  versions.forEach((ver) => {
    map[ver] = [
      ...getSlugsForVersion(ver).map((slug) => {
        const configRedirects = loadDocsConfig(ver).redirects;
        let foundedConfigRedirect = "";

        foundedConfigRedirect = configRedirects?.find(
          (elem) => elem.destination === slug
        )?.source;

        return {
          path: slug,
          ...(foundedConfigRedirect && { foundedConfigRedirect }),
        };
      }),
    ];
  });

  writeFileSync(resolve("utils", "articleLinks.json"), JSON.stringify(map));
};
