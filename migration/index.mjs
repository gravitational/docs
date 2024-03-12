/*
 * List of plugins and settings for them used on the docs pages.
 */

import { resolve } from "path";
import { readFileSync, writeFileSync, rmSync, existsSync, cpSync } from "fs";
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
import remarkMintlifyUpdateImages from "../.build/server/remark-mintlify-update-images.mjs";
import remarkMintlifyUpdateFrontmatter from "../.build/server/remark-mintlify-update-frontmatter.mjs";
import remarkMintlifyUpdateLinks from "../.build/server/remark-mintlify-update-links.mjs";
import remarkMintlifyUpdateMTags from "../.build/server/remark-mintlify-update-tags.mjs";

import {
  getVersion,
  getVersionRootPath,
} from "../.build/server/docs-helpers.mjs";
import { loadConfig as loadConfigSite } from "../.build/server/config-site.mjs";
import { loadConfig } from "../.build/server/config-docs.mjs";
import { getDocsPagesMap } from "../.build/server/paths.mjs";
import { getDocsPaths } from "../.build/server/docs-helpers.mjs";

const RESULT_DIR = resolve("migration-result"); // Name of the result folder
const ASSETS_DIR = `${RESULT_DIR}/assets`; // Name of the assets folder

// Base mint.json fields
const initialMintJson = JSON.parse(
  readFileSync(resolve("migration/initial-mint.json"), "utf-8")
);

const processFile = async (vfile, { slug }) => {
  return unified()
    .use(remarkParse) // Parse to AST
    .use(remarkMDX) // Add mdx parser
    .use(remarkGFM) // Add tables parser
    .use(remarkFrontmatter) // Add frontmatter support
    .use(remarkMintlifyUpdateFrontmatter, { version: getVersion(vfile.path) }) // Add version to the frontmatter
    .use(remarkIncludes, {
      rootDir: getVersionRootPath(vfile.path),
    }) // Resolves (!include.ext!) syntax
    .use(remarkVariables, {
      variables: loadConfig(getVersion(vfile.path)).variables || {},
    }) // Resolves (=variable=) syntax
    .use(remarkMintlifyUpdateLinks, { slug }) // Make links absolute and remove mdx extension
    .use(remarkCopyLinkedFiles, {
      destinationDir: ASSETS_DIR,
      buildUrl: ({ filename }) => `/assets/${filename}`,
    }) // Move all assets to public dir, add hashed to filenams and removes duplicates
    .use(remarkMintlifyUpdateImages, {
      staticPath: "/assets",
      destinationDir: ASSETS_DIR,
    }) // Convert markdown images to mdx images and add correct width and height
    .use(remarkMintlifyUpdateMTags) // Migrate tags to Mintlify analogues
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
    }) // Stringify AST to string with correct syntax options
    .process(vfile);
};

const docsPageMap = getDocsPagesMap(); // Slugs' hash in { slug: filepath } format

const processFiles = () => {
  // Get list of slugs that needs to be build
  getDocsPaths()
    // Convert from nextjs slug format to strings
    .map(({ params }) =>
      params && Array.isArray(params.slug) ? `/${params.slug.join("/")}/` : "/"
    )
    .forEach(async (slug) => {
      const filePath = docsPageMap[slug]; // get filepath for slug

      const file = readSync(filePath, "utf-8");

      // Generates slug for the page in mintlify format
      const newBasePath = `/docs${slug.replace(/\/$/, "")}.mdx`;

      // Location for the generated mdx page
      const newFilePath = resolve(`${RESULT_DIR}${newBasePath}`);

      const result = await processFile(file, {
        slug: `/docs${slug.replace(/\/$/, "")}`,
      });

      // Create folder recursively
      ensureFileSync(newFilePath);

      writeFileSync(
        newFilePath,
        result.value
          .replaceAll(/\<!----\>\n\n/g, "") // HACK: Fixes bug with includes'stringifying
          .replaceAll(
            "project\\_path:{group}/{project}:ref\\_type:{type}:ref:{branch_name}",
            "`project\\_path:{group}/{project}:ref\\_type:{type}:ref:{branch_name}`"
          ) // HACK: Fixes bug with non-existing variables
      );
    });
};

// Process navigation entry
const processEntry = ({ title, slug, entries }, version) => {
  let newSlug = `docs${slug.replace(/\/\s*$/, "")}`;

  // Mintlyfy does not allows categories to be links themselves so we need to move current link
  // to the pages array to
  if (entries && slug) {
    return {
      group: title,
      pages: [newSlug, ...entries.map((entry) => processEntry(entry))],
      version,
    };
  } else if (entries) {
    return {
      group: title,
      pages: entries.map((entry) => processEntry(entry)),
      version,
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
          version,
        };
      })
    );

    // Make hash from redirects to remove duplicated (Mintlify throws error on them)
    const redirectsHash = versionConfig.redirects.reduce(
      (result, { source, destination }) => {
        return { ...result, [`/docs${source}`]: `/docs${destination}` };
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
    resolve(`${RESULT_DIR}/mint.json`),
    JSON.stringify(initialMintJson)
  );
};

// Remove previous build results
if (existsSync(RESULT_DIR)) {
  rmSync(RESULT_DIR, { recursive: true });
}

// Copy assets and favicons to result folder
cpSync(resolve("migration/base"), RESULT_DIR, { recursive: true });

processFiles(); // Process, move and rename mdx files
generateMintJson(); // Generate one config from separate configs
