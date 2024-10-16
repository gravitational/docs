import "dotenv/config";
import type { Config } from "@docusaurus/types";
import type { VFile } from "vfile";

import { loadConfig } from "./server/config-docs";
import {
  getDocusaurusConfigVersionOptions,
  getLatestVersion,
} from "./server/config-site";
import remarkUpdateAssetPaths from "./server/remark-update-asset-paths";
import remarkIncludes from "./server/remark-includes";
import remarkVariables from "./server/remark-variables";
import remarkUpdateTags from "./server/remark-update-tags";
import remarkTOC from "./server/remark-toc";
import { fetchVideoMeta } from "./server/youtube-meta";
import { getRedirects } from "./server/redirects";
import {
  updateAssetPath,
  getVersionFromVFile,
  getRootDir,
  updatePathsInIncludes,
} from "./server/asset-path-helpers";
import { extendedPostcssConfigPlugin } from "./server/postcss";

const latestVersion = getLatestVersion();

const config: Config = {
  customFields: {
    innkeepConfig: {
      apiKey: process.env.INKEEP_API_KEY,
      integrationId: process.env.INKEEP_INTEGRATION_ID,
      organizationId: process.env.INKEEP_ORGANIZATION_ID,
    },
  },
  clientModules: [
    "./src/styles/variables.css",
    "./src/styles/fonts-lato.css",
    "./src/styles/fonts-ubuntu.css",
    "./src/styles/global.css",
  ],
  themeConfig: {
    image: "/og-image.png",
    colorMode: {
      defaultMode: "light",
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    headTags: [
      {
        tagName: "link",
        attributes: {
          rel: "apple-touch-icon",
          href: "/apple.png",
        },
      },
      {
        tagName: "link",
        attributes: {
          rel: "manifest",
          href: "/manifest.webmanifest",
        },
      },
      {
        tagName: "script",
        attributes: {
          type: "application/ld+json",
        },
        innerHTML: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Corporation",
          name: "Teleport",
          alternateName: "Gravitational Inc.",
          url: "https://goteleport.com/",
          logo: "https://goteleport.com/static/og-image.png",
          sameAs: [
            "https://www.youtube.com/channel/UCmtTJaeEKYxCjfNGiijOyJw",
            "https://twitter.com/goteleport/",
            "https://www.linkedin.com/company/go-teleport/",
            "https://en.wikipedia.org/wiki/Teleport_(software)",
          ],
        }),
      },
      {
        tagName: "script",
        attributes: {
          type: "application/ld+json",
        },
        innerHTML: JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "WebSite",
          name: "Teleport Docs",
          url: "https://goteleport.com/docs/",
        }),
      },
    ],
    metadata: [
      { name: "author", content: "Teleport" },
      { property: "og:type", content: "website" },
    ],
  },

  title: "Teleport",
  favicon: "/favicon.ico",
  url: "https://goteleport.com",
  baseUrl: "/",

  markdown: {
    parseFrontMatter: async (params) => {
      const result = await params.defaultParseFrontMatter(params);

      // TODO remove this hack when update filenames in the repo.
      // Right now docusaurus converts `openssh/openssh.mdx` to `/openssh/` slug,
      // so to force old slugs we need to add them to frontmatter.
      // See https://docusaurus.io/docs/create-doc#doc-urls
      if (
        params.filePath.endsWith("/server-access/guides/openssh/openssh.mdx")
      ) {
        result.frontMatter.slug = "/server-access/guides/openssh/openssh";
      } else if (params.filePath.endsWith("openssh/openssh.mdx")) {
        result.frontMatter.slug = "/server-access/openssh/openssh";
      }

      // If we have videoBanner file in config, we load this vide data through YouTube API.
      const { videoBanner } = result.frontMatter;

      if (typeof videoBanner === "string") {
        result.frontMatter.videoBanner = await fetchVideoMeta(videoBanner);
      }

      return result;
    },
  },

  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  plugins: [
    [
      "@docusaurus/plugin-client-redirects",
      {
        // Generate common redirects list for all versions
        redirects: [...getRedirects()],
        // Solves migration from "current" to "latest" version
        createRedirects(existingPath: string) {
          if (existingPath.startsWith(`/ver/${latestVersion}`)) {
            return existingPath.replace(`/ver/${latestVersion}`, "");
          }
        },
      },
    ],
    "@docusaurus/theme-classic",
    "@docusaurus/plugin-sitemap",
    [
      "@docusaurus/plugin-content-docs",
      {
        sidebarPath: "./sidebars.json",
        lastVersion: latestVersion,
        versions: getDocusaurusConfigVersionOptions(),
        // Our custom plugins need to be before default plugins
        beforeDefaultRemarkPlugins: [
          remarkTOC,
          [
            remarkIncludes,
            {
              rootDir: (vfile: VFile) => getRootDir(vfile),
              updatePaths: updatePathsInIncludes,
            },
          ],
          [
            remarkVariables,
            {
              variables: (vfile: VFile) =>
                loadConfig(getVersionFromVFile(vfile)).variables,
            },
          ],
          [
            remarkUpdateAssetPaths,
            {
              updater: updateAssetPath,
            },
          ],
          remarkUpdateTags,
        ],
      },
    ],
    extendedPostcssConfigPlugin,
    process.env.NODE_ENV === "production" && "@docusaurus/plugin-debug",
  ].filter(Boolean),
};

export default config;
