/*
 * Each version of the docs has it's own config stored at
 * /content/X.X/docs/config.json. This file normalises and validates
 * these config files.
 */

import type { Redirect } from "next/dist/lib/load-custom-routes";

import Ajv from "ajv";
import { validateConfig } from "./config-common";
import { resolve, join } from "path";
import { existsSync, readFileSync } from "fs";
import { isExternalLink, isHash, splitPath } from "../utils/url";
import { NavigationCategory, NavigationItem } from "../layouts/DocsPage/types";
import { loadConfig as loadSiteConfig } from "./config-site";

const { latest } = loadSiteConfig();
export interface Config {
  navigation: NavigationCategory[];
  variables?: Record<string, unknown>;
  redirects?: Redirect[];
}

const getConfigPath = (version: string) =>
  resolve("content", version, "docs/config.json");

/*
 * Try to load config file and throw error if it does not exists.
 */

export const load = (version: string) => {
  const path = getConfigPath(version);

  if (existsSync(path)) {
    const content = readFileSync(path, "utf-8");

    return JSON.parse(content) as Config;
  } else {
    throw Error(`File ${path} does not exists.`);
  }
};

/*
 * This a JSON schema describing content/X.X/docs/config.json file format, if actual config
 * have wrong fields or don't have something required, it will throw error then we try
 * to start dev or build mode.
 */

const ajv = new Ajv();

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
          entries: {
            type: "array",
            items: {
              type: "object",
              $id: "navigation-item",
              properties: {
                title: { type: "string" },
                slug: { type: "string" },
                hideInScopes: {
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
 * adds the docs version to the URL. It also throws an error if the docs page
 * corresponding to the URL does not exist. The assumption is that docs pages
 * are stored in content/<version>/docs/pages. Callers can ignore errors for
 * nonexistent files by setting `checkExistence` to false.
 *
 */
export const normalizeDocsUrl = (
  version: string,
  url: string,
  checkExistence: boolean = true
) => {
  if (isExternalLink(url) || isHash(url)) {
    return url;
  }

  const path = splitPath(url).path;
  const configPath = getConfigPath(version);

  if (!path.endsWith("/")) {
    throw Error(`File ${configPath} misses trailing slash in '${url}' path.`);
  }

  // Each URL in the docs config begins at docs/pages within a given version's
  // content directory. Get the MDX file for a given URL and check if it
  // exists in the filesystem. URL paths must point to (a) an MDX file with
  // the same name as the final path segment; (b) a file named "index.mdx"; or
  // (c) a file named "introduction.mdx".
  const mdxPath = path.replace(/\/$/, ".mdx");
  const docsPagePath = resolve(
    join("content", version, "docs", "pages", mdxPath)
  );

  const indexPath = resolve(
    join("content", version, "docs", "pages", path + "index.mdx")
  );

  const introPath = resolve(
    join("content", version, "docs", "pages", path + "introduction.mdx")
  );

  if (
    checkExistence &&
    [docsPagePath, indexPath, introPath].find((p) => {
      return existsSync(p);
    }) == undefined
  ) {
    throw Error(
      `URL ${path} in ${configPath} points to nonexistent file ${docsPagePath}`
    );
  }

  const addVersion = latest !== version;
  const prefix = `${addVersion ? `/ver/${version}` : ""}`;

  return prefix + url;
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
      source: normalizeDocsUrl(version, redirect.source, false),
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

/* Load, validate and normalize config. */

export const loadConfig = (version: string) => {
  const config = load(version);

  validateConfig<Config>(validator, config);

  return normalize(config, version);
};
