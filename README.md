# Getting started

## Prerequisites

**Node.js 14+ is installed in the system.**

If you don't have Node.js installed, or its version is smaller than 14, follow
[this guide](https://nodejs.org/en/download/package-manager/) to install it.

**`yarn` is installed in the system as a package manager.**

Yarn in an alternative package manager for Node.js. It needs to be installed separately.
If you already have Node.js installed, run the following command to add Yarn:

```bash
npm install --global yarn
```

## Installation

Clone the repo and init submodules with the actual docs:

```bash
git clone git@github.com:gravitational/docs.git
cd docs
git submodule init
```

To update docs to the latest version from master, run:

```bash
yarn git-update
```

(Note that the `git-update` operation may take 20+ minutes to complete)

Install dependencies with:

```bash
yarn
```

## Running docs

Now run one of the following commands:

- `yarn dev` - will run development server for docs at `localhost:3000/docs` that will autorefresh pages in real time when you edit markdown documents.
  - If you edit a partial file in `docs/pages/includes`, you will need to stop the dev server and restart it to re-include the partial.
- `yarn build` - will build static production version.
- `yarn start` - will display documentation built with `npm run build` at `localhost:3000`.
- `yarn update-and-build` - shortcut for submodule update and build (this command is used on deploy to Vercel). Do not use this command if you plan to edit docs locally - on `run` it will switch your branch to the latest commit in `master` that can cause conflicts with your locally edited files.

## Development-related commands

- `yarn test` – runs tests. Used on CI.
- `yarn lint` – checks JS and TS files for errors and automatically fixes them.
- `yarn lint-check` – checks JS and TS files for errors, but doesn't fix them. Checked in CI and on commit.
- `yarn typecheck` – validates TypeScript type-related errors. Used on CI.
- `yarn git-update` – shortcut for submodule update, also used as part of `yarn update-and-build`.
- `yarn build-node` – builds configs and plugins for mdx.
- `yarn add-symlinks` – creates symlinks from different versions of docs to `pages` directory.
- `yarn markdown-lint` – lints `*.mdx` files inside `content/**/docs/pages/` folders for syntax errors.
- `yarn markdown-lint-external-links` – same as `yarn markdown-lint` but checks that external links work. Separate command because of slowness.
- `yarn markdown-fix` – fixes syntax automatically in `*.mdx` files inside `content/**/docs/pages/`.
- `yarn storybook` – runs [Storybook](https://storybook.js.org/) instance at the `6006` port. You can check existing components here and try different options.
- `yarn build-storybook` – builds static version of Storybook.

### Previewing changes locally with Docker

To preview local changes you've made to `teleport/docs` with Docker, try this script:

```bash
#!/bin/bash
DOCKER_IMAGE=node:14-slim
DOCS_PATH=/abs/path/to/gravitational/docs # replace with the path to a git checkout of the gravitational/docs repo
TELEPORT_PATH=/abs/path/to/gravitational/teleport # replace with the path to a git checkout of the gravitational/teleport repo
SEM_VER=12.x # change this to whatever the latest version is

docker run --rm -ti -v $DOCS_PATH:/src -v $TELEPORT_PATH:/src/content/$SEM_VER -w /src --entrypoint=/bin/bash -p 3000:3000 ${DOCKER_IMAGE} -c "npm install && yarn dev"
```

You will need to have run `git submodule update --init --remote` in the `content` subdirectory of the `gravitational/docs` repo first to make sure that all the
submodule checkouts of the docs repo are up to date, or you'll get errors like `Error: File /src/content/9.0/docs/config.json does not exist`

Once things are running properly, you can navigate to http://localhost:3000/docs to view your edits to the docs. Saving changes to a file will live reload the
page. If you edit a partial file in `docs/pages/includes`, you will need to stop the dev server and restart it to re-include the partial.

## `config.json`

File that configures build options:

- `versions` - array of the available options, should match the names of the folders inside `content` dir. Will be shown in the version select in inverted order.
- `redirects` - optional array of redirects. Uses [Next.js syntax](https://nextjs.org/docs/api-reference/next.config.js/redirects) inside.

Format of version entry:

- `name` - required. Name of the folder in `content` and name of branch in version's dropdown on the site.
- `branch` - required. Name of branch for this version. Will be used for `edit` links on the docs pages.
- `latest` - not required. First entry with this field will be current version. If no entries have this field, then the last version in array will be considered the latest.

## Working with docs files

### Docs folder structure

`content/*.*/docs` - is a docs folder. Inside of it we have docs for different Teleport versions with the following structure:

- `img/` - folder for images used inside the pages.
- `pages/` - `.md` or `.mdx` files with actual page content. Every file in this folder will be rendered as a page.
- `config.json` - docs version config.

### Adding new docs version

- Add new submodule: `git submodule add -b branch/*.* https://github.com/gravitational/teleport/ content/*.*` where `branch/*.*` is the name of the branch in the main Teleport repo and `content/*.*` is the name of the subfolder in the `content` folder where the docs will be stored. Name of the folder inside `content` should match the name of the version in the config. Folder name itself can contain any characters allowed in the URL. E.g. `6.0-rc`.
- Add new entry to the `versions` array in `config.json` with name and branch field.
- Change `latest` field to the new value if you want to make it the default.

### Changing the branch that the docs version is pointing to

- Open `.gitmodules` file.
- Find corresponding record. For example, for version `4.4` it will look like this:
  ```bash
  [submodule "content/4.4"]
    path = content/4.4
    url = https://github.com/gravitational/teleport/
    branch = branch/4.4
  ```
- Change `branch` field to the new branch name.
- Run `yarn git-update` – this will update all submodules to the HEAD commits
  of the corresponding branches.

### Removing existing docs version

Correct way to remove submodule:

```bash
# Remove the submodule entry from .git/config
git submodule deinit -f path/to/submodule

# Remove the submodule directory from the superproject's .git/modules directory
rm -rf .git/modules/path/to/submodule

# Remove the entry in .gitmodules and remove the submodule directory located at path/to/submodule
git rm -f path/to/submodule
```

[Source](https://stackoverflow.com/a/36593218/1008291).

## Custom syntaxes used in the docs

- `(= variable =)` – will insert variable from `docs/config.json`'s `variables` field.
- `(! path-to-file.yaml !)` - will insert file's content in the docs. Path should be relative to submodule's root.

## Working with images

Suffix `@Nx` at the end of the image name will tell the browser to scale the image down by the number after the `@`.

E. g. `filename@2x.png` means that this image is Retina-ready and should be rendered at half size. Same with `@3x`, `@1.5x`, etc.

## How to add video banner

To display the banner, add the key `videoBanner` to the page's meta-information (where we write `title`, `h1`, etc.). Provide the YouTube video's ID as the key's value.

### ID of the YouTube video

Open the video on YouTube. In the video's URL, copy the part that is after `?v=`. This is the video's ID.

For example if the link was `https://www.youtube.com/watch?v=UFhT52d5bYg`, copy `UFhT52d5bYg`.

Once we have the `videoBanner` key and the video's ID in the meta-information, there may be a video banner with a fake title and preview on the page. It's connected that in your local stand missing the YouTube API Key.

### Adding YouTube API Key

At the root of the project, create an `.env.local` file. Inside this file, add the `YOUTUBE_API_KEY` variable with the API key's value:

```
YOUTUBE_API_KEY=[key-for-google-api]
```

Get the API key via these [instructions](https://developers.google.com/youtube/v3/getting-started#intro).
