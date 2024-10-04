# Website

This a port of the Teleport docs from the original custom engine to [Docusaurus](https://docusaurus.io/).

## Installation

```
$ yarn
```

Create `.env` file with variables: `SANITY_PROJECT_ID` and `SANITY_DATASET` tom make menu and events work.

## Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

Deployment happens automatically to commits to the `main` branch. Deploy is woriking thought AWS Amplify.

Settings for AWS Amplify are following:

1. `nodejs` 20 and `yarn` v1.22.22.
2. Build command `yarn build`
4. Build results folder `build`
5. Following env variables should be set: `INKEEP_API_KEY`, `INKEEP_INTEGRATION_ID`, `INKEEP_ORGANIZATION_ID`, `YOUTUBE_API_KEY`, `SANITY_PROJECT_ID`, `SANITY_DATASET`.
6. This variable should be set increase nodejs memory `NODE_OPTIONS=--max-old-space-size=8192`
7. Add the following redirect to make 404 work:
    - Source address: `/<*>` 
    - Target address: `/404.html`
    - Type `404 (Rewrite)`

## Architecture overview

Current setup is made with the goal to make this project backward compatible with the original [docs engine](https://github.com/gravitational/docs) so they can run in parallel until transition period is not over.

To make it possible, we convert content from the orginal format to the Docusaurus format at the build time and also use some of the orignal plugins.

How it works under the hood:

1. We store docs in the git submodules of the main `teleport` repo as in the original setup. Submodules are fetched inside `content` folder to the subfolders named after the teleport versions `15.x`, `16.x`, etc. Then we build the docs we update submodules to the latest version.
2. Info about versions, their status and original branches are manually added to the `config.json` file. See version config description below.
3. To make old docs work with Ducsaurus we need to move files to correct location and also generate a bunch of config files. To do it we use `scripts/prepare-files.mts` file. It does the following based on `config.json` content:
    1. Move mdx files, except `includes` to the `versioned_docs/version-{name}` folder for the non-current versions.
    2. Move mdx files, except `includes` to the `docs` folder for the `current` version.
    3. Create `versioned_sidebars/version-{name}-sidebars.json` configs for sidebars of the non-current versions.
    4. Create `sidebars.json` config for sidebar of the `current` version.
    5. Create `versions.json` file with the list of non-current versions.
4. To make old docs work with Docusaurus we also need to run them through a bunch of custom plugins:
    1. `remark-includes` - plugin from the old docs to work with the `(!filepath!)` syntax.
    2. `remark-variables` - plugin from the old docs to work with the `(=variable=)` syntax.
    3. `remark-update-asset-paths` - this plugn updates paths to the assets from new folders to the `content/{version}` folders.
    4. `remark-update-tags` - this plugin replaces custom components used in the old docs to their Docuaaurus alternatives or removes them completely.

Everything else is more or less straightforward Docusaurus code.

### Folder structure

`content` – folder for docs content.
`scripts` – helper CLI scripts.
`server` – code for plugins, and config parsing.
`src` - forntend-related files.
`src/component` – components ported from the old site, mostly header-related.
`src/styles` – css used in header.
`src/theme` – overrides for default theme files of Docusaurus
`src/utls` – client-side utils.
`staitc` - static files for the site: manifests, favicons, etc.

`docs`, `versioned_docs` are `versioned_sidebars` – folders for docs content that will be automatically populated by script.

`data` is a folder for sanity content.

### `config.json` format

```
type Version = {
    name: string; // should be the same as the folder in `content`
    branch: string; // name of the original git branch
    deprecated: boolean; // Unsupported versions
    latest: boolean; // Last officially released version
    current: boolean; // Next version currently in development
}

type Config = {
    versions: Version[]
}
```

Only non-deprecated versions are built in the docs. 

If no versions are marked as `current`/`latest`, last version in alphabetical order is marked as it.

### CLI commands

`yarn git-update` – update git modules.
`yarn prepare-files` – copy files from `content` to docusaurus folders.
`yarn prepare-sanity-data` - fetching and saving data form navigation for Sanity.
`yarn start` – start server in dev mode.
`yarn build` - buld static site.
`yarn swizzle` - used to eject files from default Docusaurus theme to `src/theme` folder. `see [swizzling](https://docusaurus.io/docs/swizzling).
`yarn serve` – server static files.
`yarn typecheck` - check types.

For other commands see [Docusaurus docs](https://docusaurus.io/docs/cli#docusaurus-cli-commands).
