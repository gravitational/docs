import { loadConfig as loadDocsConfig } from "./config-docs";
import { getVersionNames } from "./config-site";

const versions = getVersionNames();

// Gather all redirects from all versions and convert them in the Docusaurus format.

export const getRedirects = () => {
  const result = versions.flatMap((version) => {
    const config = loadDocsConfig(version);

    return config.redirects || [];
  });

  return result.map((redirect) => {
    // If a page is an index page for a section, it has the same name as the
    // containing subdirectory. If a redirect destination is a menu page,
    // rewrite it to point to the containing URL path so Docusaurus recognizes
    // it as a valid redirect.
    const pathSegs = redirect.destination
      .replaceAll(new RegExp("/$", "g"), "")
      .split("/");
    if (
      pathSegs.length >= 2 &&
      pathSegs[pathSegs.length - 1] == pathSegs[pathSegs.length - 2]
    ) {
      redirect.destination =
        pathSegs.slice(0, pathSegs.length - 2).join("/") + "/";
    }

    return {
      from: `/docs${redirect.source}`,
      to: `/docs${redirect.destination}`,
    };
  });
};
