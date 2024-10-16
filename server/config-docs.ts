/*
 * Each version of the docs has it's own config stored at
 * /content/X.X/docs/config.json. This file normalises and validates
 * these config files.
 */

import Ajv from "ajv";
import { validateConfig } from "./config-common";
import { resolve } from "path";
import { existsSync, readFileSync } from "fs";
import { isExternalLink, isHash, splitPath } from "../src/utils/url";
import { getLatestVersion } from "./config-site";

type RouteHas =
  | {
      type: "header" | "query" | "cookie";
      key: string;
      value?: string;
    }
  | {
      type: "host";
      key?: undefined;
      value: string;
    };

type Redirect = {
  source: string;
  destination: string;
  basePath?: false;
  locale?: false;
  has?: RouteHas[];
  missing?: RouteHas[];
} & (
  | {
      statusCode?: never;
      permanent: boolean;
    }
  | {
      statusCode: number;
      permanent?: never;
    }
);
export const scopeValues = ["oss", "enterprise", "cloud", "team"] as const;

export type ScopeType = (typeof scopeValues)[number];
export type ScopesType = ScopeType | ScopeType[];

export type ScopesInMeta = [""] | ["noScope"] | ScopeType[];

interface BaseNavigationItem {
  title: string;
  slug: string;
  entries?: NavigationItem[];
  generateFrom: string;
}
export interface RawNavigationItem extends BaseNavigationItem {
  forScopes?: ScopeType[];
}

export interface NavigationItem extends BaseNavigationItem {
  forScopes: ScopesInMeta;
}

export interface NavigationCategory {
  icon: string;
  title: string;
  entries: NavigationItem[];
  generateFrom?: string;
}

const latest = getLatestVersion();

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

  if (existsSync(path)) {
    const content = readFileSync(path, "utf-8");

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
          generateFrom: {
            type: "string",
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
  }, [] as string[]);
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

/* Load, validate and normalize config. */

export const loadConfig = (version: string) => {
  const config = load(version);

  validateConfig<Config>(validator, config);

  return normalize(config, version);
};

const makeIdFromSlug = (slug: string, version) => {
  const newSlug = slug
    .replace(`/ver/${version}/`, "")
    .replace(/\/$/, "")
    .replace(/^\//, "");

  // Docusaurus requires explicit index name in configs.
  return newSlug || "index";
};

const makeDocusaurusDocFromEntry = (entry: NavigationItem, version: string) => {
  return {
    type: "doc",
    label: entry.title,
    id: makeIdFromSlug(entry.slug, version),
  };
};

const makeDocusaurusCategoryFromEntry = (
  entry: NavigationItem,
  version: string
) => {
  const category = {
    type: "category",
    label: entry.title,
    collapsible: true,
    items: entry.entries?.map((subEntry) =>
      subEntry.entries
        ? makeDocusaurusCategoryFromEntry(subEntry, version)
        : makeDocusaurusDocFromEntry(subEntry, version)
    ),
  };

  if (entry.slug) {
    category.link = {
      type: "doc",
      id: makeIdFromSlug(entry.slug, version),
    };
  }

  return category;
};

export const docusaurusifyNavigation = (version: string) => {
  const config = loadConfig(version);

  return {
    docs: config.navigation.map((category) => {
      if (category.generateFrom) {
        return {
          type: "category",
          label: category.title,
          items: [
            {
              type: "autogenerated",
              dirName: category.generateFrom,
            },
          ],
        };
      }
      return {
        type: "category",
        label: category.title,
        collapsible: true,
        items: category.entries.map((entry) =>
          entry.entries
            ? makeDocusaurusCategoryFromEntry(entry, version)
            : makeDocusaurusDocFromEntry(entry, version)
        ),
      };
    }),
  };
};
