/*
 * this is the main config loading and normalization logic.
 */

import Ajv from "ajv";
import { validateConfig } from "./config-common";
import { resolve } from "path";
import { loadJson } from "./json";

interface Config {
  versions: {
    name: string;
    branch: string;
    latest?: true;
    deprecated: boolean;
  }[];
}

interface NormalizedConfig {
  latest: string;
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
    versions: supportedVersions.map(({ name }) => name),
    branches: supportedVersions.reduce((result, { name, branch }) => {
      return { ...result, [name]: branch };
    }, {}),
  };

  return result;
};

/* Load, validate and normalize config. */

export const loadConfig = () => {
  const config = load();

  validateConfig<Config>(validator, config);

  return normalize(config);
};
