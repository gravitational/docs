/*
 * Each version of the docs has it's own config stored at
 * /content/X.X/docs/config.json. This file normalises and validates
 * these config files.
 */

import type { Redirect } from "next/dist/lib/load-custom-routes";

import Ajv from "ajv";
import { validateConfig } from "./config-common";
import { dirname, resolve, join } from "path";
import fs from "fs";
import { isExternalLink, isHash, splitPath } from "../utils/url";
import { NavigationCategory, NavigationItem } from "../layouts/DocsPage/types";
import { loadConfig as loadSiteConfig } from "./config-site";
import { generateNavPaths } from "./pages-helpers";

const { latest } = loadSiteConfig();
export interface Config {
  navigation: NavigationCategory[];
  variables?: Record<string, unknown>;
  redirects?: Redirect[];
}

const getConfigPath = (version: string) =>
  resolve("content", version, "docs/config.json");

/*
 * Try to load config file and throw error if it does not exist.
 */

export const load = (version: string) => {
  const path = getConfigPath(version);

  if (fs.existsSync(path)) {
    const content = fs.readFileSync(path, "utf-8");

    return JSON.parse(content) as Config;
  } else {
    throw Error(`File ${path} does not exist.`);
  }
};

/*
 * This a JSON schema describing content/X.X/docs/config.json file format, if actual config
 * have wrong fields or don't have something required, it will throw error then we try
 * to start dev or build mode.
 */

const ajv = new Ajv({ allowUnionTypes: true });

const validator = ajv.compile({
  type: "object",
  properties: {
    variables: {
      type: "object",
    },
    navigation: {
      type: "array",
      items: {
        type: "object",
        properties: {
          icon: { type: "string" },
          title: { type: "string" },
          generateFrom: { type: "string" },
          // Entries must be empty if generateFrom is present.
          entries: {
            type: "array",
            items: {
              type: "object",
              $id: "navigation-item",
              properties: {
                title: { type: "string" },
                slug: { type: "string" },
                forScopes: {
                  anyOf: [
                    {
                      type: "string",
                    },
                    {
                      type: "array",
                      items: {
                        type: "string",
                      },
                    },
                  ],
                },
                entries: {
                  type: "array",
                  items: { $ref: "navigation-item" },
                },
              },
              required: ["title", "slug"],
              additionalProperties: false,
            },
          },
        },
        required: ["title", "icon", "entries"],
        additionalProperties: false,
      },
      minItems: 1,
      uniqueItems: true,
    },
    redirects: {
      type: "array",
      items: {
        type: "object",
        properties: {
          source: { type: "string" },
          destination: { type: "string" },
          boolean: { type: "boolean", nullable: true },
          basePath: { type: "boolean", nullable: true },
          statusCode: { type: "number", nullable: true },
          permanent: { type: "boolean", nullable: true },
          has: {
            type: "object",
            properties: {
              type: { type: "string" },
              key: { type: "string", nullable: true },
              value: { type: "string", nullable: true },
            },
            nullable: true,
            additionalProperties: false,
          },
        },
        required: ["source", "destination"],
        additionalProperties: false,
      },
    },
  },
  required: ["navigation"],
  additionalProperties: false,
});

/*
 * We store relative paths in the config so we don't need to change them all
 * when we add new version, but for next/link and next/router to work they should be absolte.
 * So we are adding "/docs/ver/X.X/" or just "/docs/" for the current version here.
 *
 * Also we check that all links ends with "/: for consistency.
 */

/*
 * normalizeDocsUrl ensures that internal docs URLs include trailing slashes and
 * adds the docs version to the URL.*
 */
export const normalizeDocsUrl = (version: string, url: string) => {
  if (isExternalLink(url) || isHash(url)) {
    return url;
  }

  const path = splitPath(url).path;
  const configPath = getConfigPath(version);

  if (!path.endsWith("/")) {
    throw Error(`File ${configPath} misses trailing slash in '${url}' path.`);
  }

  const addVersion = latest !== version;
  const prefix = `${addVersion ? `/ver/${version}` : ""}`;

  return prefix + url;
};

const getPathsForNavigationEntries = (entries: NavigationItem[]): string[] => {
  return entries.reduce((allSlugs, currentEntry) => {
    let slugs = [currentEntry.slug];
    if (currentEntry.entries) {
      const moreSlugs = getPathsForNavigationEntries(currentEntry.entries);
      slugs.push(...moreSlugs);
    }
    allSlugs.push(...slugs);
    return allSlugs;
  }, []);
};

// checkURLsForCorrespondingFiles attempts to open the URL paths provided in the
// navigation config provided by categories and the destination paths provided
// in redirects. It converts each URL path into a filename in the content
// directory rooted at dirRoot. If it fails to open a file corresponding to a
// URL path, it adds the file to an array of strings. It returns the resulting
// array.
export const checkURLsForCorrespondingFiles = (
  dirRoot: string,
  categories: NavigationCategory[],
  redirects: Redirect[]
): string[] => {
  let result: string[] = [];
  categories.forEach((cat) => {
    let slugs = getPathsForNavigationEntries(cat.entries);
    result = result.concat(slugs.flat());
  });

  result = result.concat(
    redirects.map((r) => {
      // We only check destinations because there is no expectation that the
      // source URL corresponds with a file.
      return r.destination;
    })
  );

  // Deduplicate result
  result = Array.from(new Set(result).values());

  return result.reduce((prev, curr) => {
    if (correspondingFileExistsForURL(dirRoot, curr)) {
      return prev;
    }
    prev.push(curr);
    return prev;
  }, []);
};

// checkForRedirectsFromExistingFiles returns an array of redirects in which the
// source corresponds to a file at a path rooted at dirRoot.
export const checkForRedirectsFromExistingFiles = (
  dirRoot: string,
  redirects: Redirect[]
): Redirect[] => {
  let result: Redirect[] = [];

  redirects.forEach((r) => {
    if (correspondingFileExistsForURL(dirRoot, r.source)) {
      result.push(r);
    }
  });
  return result;
};

// checkDuplicateRedirects checks the provided redirects for duplicates and
// returns an array of Redirect objects. Duplicate checks are based on the
// source of each redirect.
export const checkDuplicateRedirects = (redirects: Redirect[]): Redirect[] => {
  const result: Redirect[] = [];
  const uniques = new Set();
  redirects.forEach((r) => {
    if (uniques.has(r.source)) {
      result.push(r);
      return;
    }
    uniques.add(r.source);
  });
  return result;
};

// checkURLForCorrespondingFile determines whether a file exists in the content
// directory rooted at dirRoot for the file corresponding to the provided URL path.
// If a file does not exist, it returns false.
const correspondingFileExistsForURL = (
  dirRoot: string,
  urlpath: string
): boolean => {
  // Each URL in the docs config begins at docs/pages within a given version's
  // content directory. Get the MDX file for a given URL and check if it
  // exists in the filesystem. URL paths must point to (a) an MDX file with
  // the same name as the final path segment; (b) a file named "index.mdx"; or
  // (c) a file named "introduction.mdx".
  const mdxPath = urlpath.replace(/\/$/, ".mdx");
  const docsPagePath = resolve(join(dirRoot, mdxPath));

  const indexPath = resolve(join(dirRoot, urlpath + "index.mdx"));

  const introPath = resolve(join(dirRoot, urlpath + "introduction.mdx"));

  if (
    [docsPagePath, indexPath, introPath].find((p) => {
      return fs.existsSync(p);
    }) == undefined
  ) {
    return false;
  }
  return true;
};

const normalizeDocsUrls = (
  version: string,
  entries: NavigationItem[]
): NavigationItem[] => {
  return entries.map((entry) => {
    const newEntry = Object.assign(entry);

    newEntry.slug = normalizeDocsUrl(version, entry.slug);

    if (entry.entries) {
      newEntry.entries = normalizeDocsUrls(version, entry.entries);
    }

    return newEntry;
  });
};

/*
 * Here we normalize urls in the "navigation" section.
 */

const normalizeNavigation = (
  version: string,
  navigation: NavigationCategory[]
): NavigationCategory[] =>
  navigation.map((category) => {
    return {
      ...category,
      entries: normalizeDocsUrls(version, category.entries),
    };
  });

/*
 * Here we normalize urls in the "redirects" section.
 */

const normalizeRedirects = (
  version: string,
  redirects: Redirect[]
): Redirect[] => {
  return redirects.map((redirect) => {
    return {
      ...redirect,
      // Don't check for the existence of an MDX file for the redirect source
      source: normalizeDocsUrl(version, redirect.source),
      destination: normalizeDocsUrl(version, redirect.destination),
    };
  });
};

/*
 * Apply config normalizations (update urls, etc).
 */

export const normalize = (config: Config, version: string): Config => {
  config.navigation = normalizeNavigation(version, config.navigation);

  if (config.redirects) {
    config.redirects = normalizeRedirects(version, config.redirects);
  }

  if (!config.variables) {
    config.variables = {};
  }

  return config;
};

export const loadConfig = (version: string) => {
  const config = load(version);

  const badSlugs = checkURLsForCorrespondingFiles(
    join("content", version, "docs", "pages"),
    config.navigation,
    config.redirects
  );

  if (badSlugs.length > 0) {
    throw new Error(
      "Error parsing docs config file " +
        join("content", version, "docs", "config.json") +
        ": The following navigation slugs or redirect destinations do not " +
        "correspond to actual MDX files:\n\t- " +
        badSlugs.join("\n\t- ")
    );
  }

  const redirsFrom = checkForRedirectsFromExistingFiles(
    join("content", version, "docs", "pages"),
    config.redirects
  );

  if (redirsFrom.length > 0) {
    throw new Error(
      "Error parsing docs config file " +
        join("content", version, "docs", "config.json") +
        ': Each of the following redirects includes a "source" that corresponds to an existing file: ' +
        JSON.stringify(redirsFrom, null, 2)
    );
  }

  const duplicateRedirects = checkDuplicateRedirects(config.redirects);
  if (duplicateRedirects.length > 0) {
    throw new Error(
      "Error parsing docs config file " +
        join("content", version, "docs", "config.json") +
        ": Found redirects with duplicate sources: " +
        JSON.stringify(duplicateRedirects, null, 2)
    );
  }

  validateConfig<Config>(validator, config);

  config.navigation.forEach((item, i) => {
    if (!!item.generateFrom && item.entries.length > 0) {
      throw "a navigation item cannot contain both generateFrom and entries";
    }

    if (!!item.generateFrom) {
      config.navigation[i].entries = generateNavPaths(
        fs,
        join("content", version, "docs", "pages", item.generateFrom)
      );
    }
  });

  return normalize(config, version);
};
