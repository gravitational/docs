/*
 * this is the main config loading and normalization logic.
 */

import Ajv from "ajv";
import { validateConfig } from "./config-common";
import { resolve } from "path";
import { VersionOptions } from "@docusaurus/plugin-content-docs";
import { loadJson } from "./json";

interface Config {
  versions: {
    name: string;
    branch: string;
    latest?: true;
    current?: true;
    deprecated?: boolean;
  }[];
}

interface NormalizedConfig {
  latest: string;
  current: string;
  versions: string[];
  branches: Record<string, string>;
}

export const load = () => {
  return loadJson(resolve("config.json")) as Config;
};

/*
 * This a JSON schema describing config.json file format, if actual config
 * have wrong fields or don't have something required, it will throw error then we try
 * to start dev or build mode.
 */

const ajv = new Ajv({ allowUnionTypes: true });

const validator = ajv.compile({
  type: "object",
  properties: {
    versions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          branch: { type: "string" },
          latest: { type: "boolean", nullable: true },
          current: { type: "boolean", nullable: true },
          deprecated: { type: "boolean", nullable: true },
        },
        additionalProperties: false,
        required: ["name", "branch"],
      },
      minItems: 1,
      uniqueItems: true,
    },
  },
  required: ["versions"],
});

/*
 * Config format for storing data and config format for using data not nescessary the same.
 * Storing version data as a singe array is convenient, but for usage, having separate
 * "latest", "versions" and "branches" fileds are easier, so we transform them here.
 */

export const normalize = ({ versions }: Config): NormalizedConfig => {
  const supportedVersions = versions.filter((version) => !version.deprecated);
  const result: NormalizedConfig = {
    latest: (
      supportedVersions.find(({ latest }) => latest === true) ||
      versions[supportedVersions.length - 1]
    ).name,
    current: (
      supportedVersions.find(({ current }) => current === true) ||
      versions[supportedVersions.length - 1]
    ).name,
    versions: supportedVersions.map(({ name }) => name),
    branches: supportedVersions.reduce((result, { name, branch }) => {
      return { ...result, [name]: branch };
    }, {}),
  };

  return result;
};

/* Load and validate config. */

export const loadConfig = () => {
  const config = load();

  validateConfig<Config>(validator, config);

  return config;
};

// Returns a list of supported versions, excluding deprecated ones.s

const getSupportedVersions = () => {
  const { versions } = loadConfig();

  return versions.filter(({ deprecated }) => !deprecated);
};

// Returns name of the latest version.

export const getLatestVersion = () => {
  const versions = getSupportedVersions();

  return (
    versions.find(({ latest }) => latest === true) ||
    versions[versions.length - 1]
  ).name;
};

// Returns name of the current version.

export const getCurrentVersion = () => {
  const versions = getSupportedVersions();

  return (
    versions.find(({ current }) => current === true) ||
    versions[versions.length - 1]
  ).name;
};

/* Returns version options for docusaurus.config.js */

export const getDocusaurusConfigVersionOptions = (): Record<
  string,
  VersionOptions
> => {
  const versions = getSupportedVersions();

  return versions.reduce((result, { name, latest, current }) => {
    // Use "current" as a name for the current version. This way Docusaurus
    // will look for it in the `docs` folder instead of `versioned_docs`.
    const versionName = current ? "current" : name;

    const versionOptions: VersionOptions = {
      // Mark latest version as unreleased.
      label: current ? `${name} (unreleased)` : name,
      // Configure root path for the version. Latest in the root, others in the `ver/XX.x` folder.
      path: latest ? "" : `ver/${name}`,
    };

    // Banner will show message for the current version that it is still WIP.
    if (current) {
      versionOptions.banner = "unreleased";
    }

    return { ...result, [versionName]: versionOptions };
  }, {});
};

// Return names of all non-deprecated versions, sorted in descending order.

export const getVersionNames = (): string[] => {
  const versions = getSupportedVersions();

  return versions
    .map(({ name }) => name)
    .sort()
    .reverse();
};

/* Returns sorted list of versions for versions.json, all non-deprecated except current, */

export const getDocusaurusVersions = (): string[] => {
  const versions = getVersionNames();
  const currentVersion = getCurrentVersion();

  return versions.filter((version) => version !== currentVersion);
};
