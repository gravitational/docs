# Yarn command reference

You can run the following `yarn` commands to execute scripts in the
`gravitational/docs` repo.

Yarn in an alternative package manager for Node.js. It needs to be installed
separately.  If you already have Node.js installed, run the following command to
add Yarn:

```bash
npm install --global yarn
```

**Node.js 18+ must be installed on your system for these to work as expected.**
Read the [Node.js
documentation](https://nodejs.org/en/download/package-manager/) to install it.

## Running the docs site

|Command|Description|
|---|---|
| `yarn build` | Build a static production site.|
| `yarn dev` | Run a development server for docs at `localhost:3000/docs`. Reload the page to show the latest changes. Depends on `yarn git-update`. |
| `yarn git-update` | Shortcut for `submodule update`, also used as part of `yarn update-and-build`.|
| `yarn start` | Display documentation built with `npm run build` at `localhost:3000`.|
| `yarn update-and-build` | Command to build the site for production. Do not use for local previews since it switches the git branches of content submodules.|

## Development-related commands

|Command|Description|
|---|---|
| `yarn` | Install dependencies.|
| `yarn add-symlinks` | Create symlinks from different versions of docs to `pages` directory.|
| `yarn build-node` | Build configs and plugins for MDX.|
| `yarn build-storybook` | Builds static version of Storybook. |
| `yarn lint` | Check JS and TS files for errors and automatically fix them.|
| `yarn lint-check` | Check JS and TS files for errors, but do not fix them. Checked in CI and on commit.|
| `yarn markdown-fix` | Fix syntax automatically in `*.mdx` files inside `content/**/docs/pages/`.|
| `yarn markdown-lint-external-links` | Same as `yarn markdown-lint` but checks that external links work. Separate command because of slowness.|
| `yarn markdown-lint` | Lint `*.mdx` files inside `content/**/docs/pages/` folders for syntax errors.|
| `yarn storybook:test-ci` | Runs Storybook components tests in CI. Unlike `storybook:test-local`, it additionally includes `wait-on` command to ensure proper synchronization between the services and tests during the CI process. |
| `yarn storybook:test-local` | Runs Storybook components locally without opening Storybook instance.|
| `yarn storybook` | Run a [Storybook](https://storybook.js.org/) instance at the `6006` port. You can check existing components here and try different options.|
| `yarn test-storybook` | Run Storybook component tests via [Test Runner](https://storybook.js.org/docs/react/writing-tests/test-runner) when a Storybook instance is started at the `6006` port.|
| `yarn test` | Run tests. Used on CI.|
| `yarn typecheck` | Validate TypeScript type-related errors. Used in CI.|


