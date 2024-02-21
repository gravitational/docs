/*
 * List of plugins and settings for them used on the docs pages.
 */

import { dirname, relative, resolve } from "path";
import { writeFileSync, rmSync, existsSync, cpSync } from "fs";
import { ensureFileSync } from "fs-extra/esm";
import { readSync } from "to-vfile";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import remarkMDX from "remark-mdx";
import remarkGFM from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import remarkCopyLinkedFiles from "remark-copy-linked-files";

import remarkIncludes from "../.build/server/remark-includes.mjs";
import remarkVariables from "../.build/server/remark-variables.mjs";
import {
  getVersion,
  getVersionRootPath,
} from "../.build/server/docs-helpers.mjs";
import { loadConfig as loadConfigSite } from "../.build/server/config-site.mjs";
import { loadConfig } from "../.build/server/config-docs.mjs";
import { getDocsPagesMap } from "../.build/server/paths.mjs";
import { getDocsPaths } from "../.build/server/docs-helpers.mjs";

import remarkLinks from "./plugins/remark-links.mjs";
import remarkMigrateTags from "./plugins/remark-migrate-tags.mjs";
import remarkUpdateFrontmatter from "./plugins/remark-update-frontmatter.mjs";

const resultDir = resolve("migration-result"); // Name of the result folder
const assetsDir = `${resultDir}/assets`;

const initialMintJson = {
  $schema: "https://mintlify.com/schema.json",
  name: "Teleport",
  logo: {
    light: "/logo/light.png",
    dark: "/logo/dark.png",
  },
  favicon: "/favicon.png",
  colors: {
    primary: "#512FC9",
    light: "#7956F5",
    dark: "#512FC9",
  },
  feedback: {
    thumbsRating: true,
  },
  topbarCtaButton: {
    name: "Get Started",
    url: "https://goteleport.com/pricing/",
  },
  topbarLinks: [
    {
      name: "Sign In",
      url: "https://teleport.sh/",
    },
  ],
  versions: [],
  navigation: [],
  redirects: [],
};

const processFile = async (vfile, { slug, newFilePath }) => {
  return unified()
    .use(remarkParse) // Parse to AST
    .use(remarkMDX) // Add mdx parser
    .use(remarkGFM) // Add tables parser
    .use(remarkFrontmatter) // Add frontmatter support
    .use(remarkUpdateFrontmatter, { version: getVersion(vfile.path) }) // Add version to the frontmatter
    .use(remarkIncludes, {
      rootDir: getVersionRootPath(vfile.path),
    }) // Resolves (!include.ext!) syntax
    .use(remarkVariables, {
      variables: loadConfig(getVersion(vfile.path)).variables || {},
    }) // Resolves (=variable=) syntax
    .use(remarkLinks, { currentUri: slug }) // Make links absolute and remove mdx extension
    .use(remarkCopyLinkedFiles, {
      destinationDir: assetsDir,
      buildUrl: ({ filename }) =>
        relative(newFilePath, resolve(assetsDir, filename)),
    }) // Move all assets to result dir
    .use(remarkMigrateTags) // Migrate tags to Mintlify analogues
    .use(remarkStringify, {
      bullet: "-",
      ruleRepetition: 3,
      fences: true,
      incrementListMarker: true,
      checkBlanks: true,
      resourceLink: true,
      emphasis: "*",
      tablePipeAlign: false,
      tableCellPadding: true,
      listItemIndent: 1,
    }) // Stringify AST to string
    .process(vfile);
};

const docsPageMap = getDocsPagesMap(); // Hash in { slug: filepath } format

const processFiles = () => {
  // Get list of slugs that needs to be build
  getDocsPaths()
    // Convert from nextjs slug format to strings
    .map(({ params }) =>
      params && Array.isArray(params.slug) ? `/${params.slug.join("/")}/` : "/"
    )
    .forEach(async (slug) => {
      const filePath = docsPageMap[slug]; // get filepath for slug
      const isIndexFile = filePath.endsWith("index.mdx");

      const file = readSync(filePath, "utf-8");

      const newFileBase = resolve(`${resultDir}/${slug}`);
      const newFilePath = isIndexFile
        ? `${newFileBase}/index.mdx`
        : `${newFileBase}.mdx`;

      const result = await processFile(file, {
        slug: dirname(
          isIndexFile ? `${slug}index.mdx` : `${slug.replace(/\/$/, "")}.mdx`
        ), // dir of current file, needs for resolving relative links
        newFilePath, // path to file, needs to resolve paths to images
      });

      // Create folder recursevly
      ensureFileSync(newFilePath);

      // Replace fixes bug with includes' stringifying
      writeFileSync(newFilePath, result.value.replaceAll(/\<!----\>\n\n/g, ""));
    });
};

// Process navigation entry
const processEntry = ({ title, slug, entries }) => {
  let newSlug;

  if (slug) {
    // index.mdx case
    if (slug === "/") {
      newSlug = "index";
      // ver/16.x/index.mdx case
    } else if (/^\/ver\/[0-9x\.]+\/$/.test(slug)) {
      newSlug = `${slug.replace(/^\/+/g, "")}index`;
    } else {
      newSlug = slug.replace(/^\/+/g, "").replace(/\/\s*$/, "");
    }
  }

  // Mintlyfy does not allows categories to be links themselves so we need to move current link
  // to the pages array to
  if (entries && slug) {
    return {
      group: title,
      pages: [newSlug, ...entries.map((entry) => processEntry(entry))],
    };
  } else if (entries) {
    return {
      group: title,
      pages: entries.map((entry) => processEntry(entry)),
    };
  }

  // Mintlify does not allow navigation items to have separate text from the pages,
  // navigation item takes title from the page itself
  return newSlug;
};

const generateMintJson = () => {
  const siteConfig = loadConfigSite();

  // Add list of versions
  initialMintJson.versions = siteConfig.versions;

  siteConfig.versions.forEach((version) => {
    // Load processed and normalized config (urls has version prefixes added, etc)
    const versionConfig = loadConfig(version);

    // Add all pages from all versions to navigation
    initialMintJson.navigation.push(
      ...versionConfig.navigation.map((category) => {
        return {
          group: category.title,
          pages: category.entries.map((entry) => processEntry(entry, version)),
        };
      })
    );

    // Make hash from redirects to remove duplicated (Mintlify throws error on them)
    const redirectsHash = versionConfig.redirects.reduce(
      (result, { source, destination }) => {
        return { ...result, [source]: destination };
      },
      {}
    );

    // Add all redirects to config
    initialMintJson.redirects.push(
      ...Object.entries(redirectsHash).map(([source, destination]) => ({
        source,
        destination,
      }))
    );
  });

  // Write config to file
  writeFileSync(
    resolve(`${resultDir}/mint.json`),
    JSON.stringify(initialMintJson)
  );
};

const migration = () => {
  // Remove previous build results
  if (existsSync(resultDir)) {
    rmSync(resultDir, { recursive: true });
  }

  // Copy assets and favicons to result folder
  cpSync(resolve("migration/base"), resultDir, { recursive: true });

  processFiles(); // Process, move and rename mdx files
  generateMintJson(); // Generate one config from separate configs
};

migration();
