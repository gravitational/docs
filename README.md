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
git clone git@github.com:gravitational/next.git
cd next
git submodule init
```

To update docs to the latest version from master, run:

```bash
yarn git-update
```

Install dependencies with:

```bash
yarn
```

## Running docs

Now run one of the following commands:

- `yarn dev` - will run development server for docs at `localhost:3000/docs` that will autorefresh pages in real time when you edit markdown documents.
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

### Previewing changes locally with Docker

To preview local changes you've made to `teleport/docs` with Docker, you can run

```bash
NEXT_PATH=/abs/path/to/next
TELEPORT_PATH=/abs/path/to/teleport
SEM_VER=9.0 # Change this to whatever the latest version is

docker run --rm -ti -v $NEXT_PATH:/src -v $TELEPORT_PATH:/src/content/$SEM_VER -w /src -p 3000:3000 node:12-slim yarn dev
```

## `config.json`

File that configures build options:

- `versions` - array of the available options, should match the names of the folders inside `content` dir. Will be shown in the version select in inverted order.

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

## Marketing Team

This repo makes it easy for non-technical people to update certain pages; currently those pages are limited to Events but will expand in the future. There are two sets of instructions that follow:

**Option A:** Updating via terminal and code editor, with a final step in GitHub UI.

**Option B:** Updating via Github UI only.

### **Option A: Updating Events via terminal and code editor:**

Before attempting an update via option A, make sure you have followed the Prerequisites and Installation instructions at the top of this readme.

Events, which are just small bits of text, are located here: `pages/about/events/index.mdx` which you can open in a code editor. Scroll down within this file until you see `events:`

Each entry after that starts with a `title` field and has the following other REQUIRED fields: `description, link, start` and `location`; `end` is optional but encouraged.

Creating an event is as simple as adding a new entry to this page.

1. In a terminal window, start in the root of the next repo (we are no longer in web) and make sure you are in the `main` branch by running

```bash
git checkout main
```

and that it is up to date:

```bash
git pull origin main
```

2. check out a feature branch by running `git checkout -b [your name]/[branch name of your choice]`, e.g.:

```bash
git checkout -b nico/events
```

3. in your text editor of choice, edit the file `next/pages/about/events/index.mdx`. For example, your text addition should look like the following:

   **IMPORTANT!**

   - spacing and indentation matter. Make sure your event entry matches the indentation of the events already on the page.
   - `link` must be a url link in quotation marks.
   - `start` and `end` are in YYYY-MM-DD format.
   - If event is just one day, only provide `start` date. Remove `end` from your entry.

```
 - title: Example Event
   description: Example Event is a yearly gathering of tech and security professionals to share highlights and learn together.
   link: "https://exampleevent.io" ***MUST BE IN QUOTATION MARKS***
   start: 2022-04-01
   end: 2022-04-02
   location: Cooltown, USA
```

4. Then run these two commands in your terminal:

```bash
yarn lint
git add pages/about/events
```

5. commit your changes by running: `git commit -m "added [your event here] event"`, e.g:

```bash
git commit -m "added Example event"
```

6. push your branch to GitHub by running `git push origin [your branch name]`, e.g.

```bash
git push origin nico/events
```

7. Navigate a web browser to the next repo in GitHub [https://github.com/gravitational/next](https://github.com/gravitational/next). If you've just pushed code to this repo you will probably see a prompt front and center asking if you'd like to create a pull request. Do so!

8. Otherwise, create a pull request by clicking on `Pull requests` from the menu running along the top of the screen under `gravitational/next` and then clicking `New pull request` on the right.

9. Under the `Compare changes` heading, change the `compare` branch from `main` to the branch you created. You should see a green check with the words `Able to merge.` but if you don't please contact one of the folks listed below as reviewers.

10. Click `Create pull request` and then assign a reviewer: [@C-STYR](https://github.com/C-STYR), [@alexwolfe](https://github.com/alexwolfe),[@sandylcruz](https://github.com/sandylcruz), or [@deliaconstantino](https://github.com/deliaconstantino) (from the dropdown menu on upper-right)

11. Click `Create pull request` again.

12. Finally, notify the person(s) you selected as reviewers by pinging them on Slack. That's it, you're finished. Well done!

### **Option B: Instructions for adding Events using the Web UI on GitHub:**

1. Log into GitHub, if you aren't automatically logged in.

2. Navigate to https://github.com/gravitational/next .

3. In the file tree, click "pages".

4. Click "about".

5. Click "events".

6. Click "index.mdx".

7. On the "index.mdx" page, on the right side, above the file content, you should see several icons. Click the pencil icon to edit the file.

8. Add new text in the file directly under the last event in the events section. For example, your text addition should look like the following:

   **IMPORTANT!**

   -  spacing and indentation matter. Make sure your event entry matches the indentation of the events already on the page.
   - `link` must be a url link in quotation marks.
   - `start` and `end` are in YYYY-MM-DD format.
   -  If event is just one day, only provide `start` date. Remove `end` from your entry.

```
 - title: Example Event
   description: Example Event is a yearly gathering of tech and security professionals to share highlights and learn together.
   link: "https://exampleevent.io" ***MUST BE IN QUOTATION MARKS***
   start: 2022-04-01
   end: 2022-04-02
   location: Cooltown, USA
```

9. When you are finished, select the option that says "Create new branch for this commit and start a pull request." It is very important that you do NOT commit directly to main. Github will automatically create a branch name for you, no need to change it.

10. Click "Propose changes".

11. You will now be in a pull request screen. Assign a reviewer (C-STYR, alexwolfe, sandylcruz or deliaconstantino) by clicking the cog next to "Reviewers" on the right hand side.

12. Change the title of your PR (pull request) from "Update index.mdx" to something meaningful like "Add Example Event to the Events Page".

13. Click "Create pull request".

14. Finally, notify the person(s) you selected as reviewers by pinging them on Slack. The reviewer will merge the PR for you. Please do not merge the PR. That's it, you're finished. Well done!
