import { suite } from "uvu";
import * as assert from "uvu/assert";
import { normalizeDocsUrl } from "./config-docs";
import { randomUUID } from "crypto";
import { resolve } from "path";
import { opendirSync } from "fs";

const Suite = suite("server/config-docs");

Suite("Ensures that URLs correspond to docs pages", () => {
  // There's currently no way to pass an arbitrary directory path to
  // normalizeDocsUrl, which assumes that docs pages are in
  // "content/<version>/docs/pages. As a result, we define a fake docs page
  // path by generating a UUID.
  const fakeURL = "/" + randomUUID() + "/";

  // Use the first directory we find in the content directory to get a
  // version. We don't care which version it is since we'll be creating a fake
  // file there anyway, but we do need a real config.json file to load.
  const contentPath = resolve("content");
  const contentDir = opendirSync(contentPath);
  const vers = contentDir.readSync().name;

  // Make sure there aren't any unexpected files in the user's content directory
  if (vers.match(/^[0-9]+\.[0-9]+$/) == null) {
    throw Error("unexpected subdirectory in the content directory: " + vers);
  }

  assert.throws(
    () => {
      normalizeDocsUrl(vers, fakeURL);
    },
    (err) => {
      return err.message.includes(fakeURL);
    }
  );

  // This should not throw an exception, since there's always going to be a root
  // path.
  normalizeDocsUrl(vers, "/");
  // Disabling URL checking should not throw an exception
  normalizeDocsUrl(vers, fakeURL, false);

  contentDir.closeSync();
});

Suite.run();
