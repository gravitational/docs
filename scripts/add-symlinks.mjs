/*
 * Creates symlinks from mdx files in "content/X.X/docs/" to `pages/ver/X.X/`.
 */

import { symlinkSync, rmdirSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import glob from "glob";
import { loadConfig } from "../.build/server/config-site.mjs";

const { versions } = loadConfig();

const docsPagesRoot = "pages/ver";

if (existsSync(docsPagesRoot)) {
  rmdirSync(docsPagesRoot, { recursive: true });
}
mkdirSync(docsPagesRoot, { recursive: true });

versions.forEach((version) => {
  const source = resolve("content", version, "docs/pages");
  const destination = resolve(docsPagesRoot, version);

  const paths = glob
    .sync(resolve(source, "**/*.mdx"))
    .filter((path) => !path.includes("/includes/")); // Files in `/includes/` folders are not actual pages

  paths.forEach((oldPath) => {
    const newPath = oldPath.replace(source, destination);
    const dir = dirname(newPath);

    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    symlinkSync(oldPath, newPath);
  });
});
