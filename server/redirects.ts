import { loadConfig as loadDocsConfig } from "./config-docs";
import { getVersionNames } from "./config-site";

const versions = getVersionNames();

// Gather all redirects from all versions and convert them in the Docusaurus format.

export const getRedirects = () => {
  const result = versions.flatMap((version) => {
    const config = loadDocsConfig(version);

    return config.redirects || [];
  });

  return result.map((redirect) => ({
    from: `/docs${redirect.source}`,
    to: `/docs${redirect.destination}`,
  }));
};
