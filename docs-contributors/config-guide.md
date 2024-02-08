# Configuring the Teleport docs site

This guide explains the options and configuration files available for the
Teleport docs site.

## `config.json`

File that configures build options:

- `versions` - array of the available options, should match the names of the folders inside `content` dir. Will be shown in the version select in inverted order.
- `redirects` - optional array of redirects. Uses [Next.js syntax](https://nextjs.org/docs/api-reference/next.config.js/redirects) inside.

Format of version entry:

- `name` - required. Name of the folder in `content` and name of branch in version's dropdown on the site.
- `branch` - required. Name of branch for this version. Will be used for `edit` links on the docs pages.
- `latest` - not required. First entry with this field will be current version. If no entries have this field, then the last version in array will be considered the latest.

## Adding a new docs version

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

### Adding a YouTube API Key

At the root of the project, create an `.env.local` file. Inside this file, add the `YOUTUBE_API_KEY` variable with the API key's value:

```
YOUTUBE_API_KEY=[key-for-google-api]
```

Get the API key via these [instructions](https://developers.google.com/youtube/v3/getting-started#intro).
