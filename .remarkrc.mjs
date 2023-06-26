import { resolve } from "path";
import { defaultScopes } from "./.build/server/docs-helpers.mjs";
import remarkVariables from "./.build/server/remark-variables.mjs";
import remarkIncludes from "./.build/server/remark-includes.mjs";
import remarkCodeSnippet from "./.build/server/remark-code-snippet.mjs";
import remarkLintDetails from "./.build/server/remark-lint-details.mjs";
import remarkLintFrontmatter from "./.build/server/remark-lint-frontmatter.mjs";
import { remarkLintTeleportDocsLinks } from "./.build/server/lint-teleport-docs-links.mjs";
import {
  getVersion,
  getVersionRootPath,
  getPageMeta,
} from "./.build/server/docs-helpers.mjs";
import { remarkLintScopes } from "./.build/server/remark-lint-scopes.mjs";
import {
  loadConfig,
  loadMessagingConfig,
} from "./.build/server/config-docs.mjs";
import { remarkLintMessaging } from "./.build/server/remark-lint-messaging.mjs";

const configFix = {
  settings: {
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
  },
  plugins: ["frontmatter", "mdx"],
};

const configLint = {
  plugins: [
    "frontmatter",
    "mdx",
    "preset-lint-markdown-style-guide",
    ["lint-table-pipe-alignment", false],
    ["lint-table-cell-padding", false],
    ["lint-maximum-line-length", false],
    ["lint-no-consecutive-blank-lines", false],
    ["lint-no-emphasis-as-heading", false],
    ["lint-fenced-code-flag", { allowEmpty: true }],
    ["lint-file-extension", false],
    ["lint-no-duplicate-headings", false],
    ["lint-list-item-spacing", { checkBlanks: true }],
    ["lint-no-shell-dollars", false],
    ["lint-list-item-indent", "space"],
    "lint-ordered-list-marker-value",
    ["lint-maximum-heading-length", false],
    ["lint-no-shortcut-reference-link", false],
    [
      remarkIncludes, // Lints (!include.ext!) syntax
      {
        lint: true,
        rootDir: (vfile) => getVersionRootPath(vfile.path),
      },
    ],
    [
      remarkVariables, // Lints (=variable=) syntax
      {
        lint: true,
        variables: (vfile) => {
          return loadConfig(getVersion(vfile.path)).variables || {};
        },
      },
    ],
    // validate-links must be run after remarkVariables since some links
    // include variables in their references, e.g.,
    // [CM-08 Information System Component Inventory]((=fedramp.control_url=)CM-8)
    ["validate-links", { repository: false }],
    [remarkLintTeleportDocsLinks],
    [remarkCodeSnippet, { lint: true, langs: ["code", "bash"] }],
    [remarkLintDetails, ["error"]],
    // Disabling the remarkLintFrontmatter check until we fix
    // gravitational/docs#80
    // [remarkLintFrontmatter, ["error"]],
    [
      remarkLintMessaging,
      loadMessagingConfig(resolve("messaging-config.json")),
    ],
    [
      remarkLintScopes,
      (vfile) => {
        const scopes = getPageMeta(vfile.path).scopes;
        // getPageMeta assigns the "scopes" field to [""] if
        // the page's forScopes config includes no scopes.
        if (scopes.indexOf("") !== -1 && scopes.length === 1) {
          return defaultScopes;
        }
        return scopes;
      },
    ],
  ],
};

if (process.env.WITH_EXTERNAL_LINKS) {
  configLint.plugins.push([
    "lint-no-dead-urls",
    {
      skipLocalhost: true,
      skipUrlPatterns: [
        /teleport\.example\.com/,
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsaccountname",
        "https://github.com/gravitational/teleport/blob/v{{teleport_version}}/examples/chart/teleport-cluster/templates/clusterrole.yaml",
        "https://linuxize.com/post/linux-chown-command/",
      ],
    },
  ]);
}

export default process.env.FIX ? configFix : configLint;
