import { Volume, createFsFromVolume } from "memfs";
import { default as remarkTOC, getTOC } from "../server/remark-toc";
import { readFileSync } from "fs";
import { resolve } from "path";
import { suite } from "uvu";
import * as assert from "uvu/assert";
import { VFile, VFileOptions } from "vfile";
import remarkMdx from "remark-mdx";
import remarkGFM from "remark-gfm";
import { remark } from "remark";

const Suite = suite("server/remark-toc");

Suite("getTOC with one link to a directory", () => {
  const expected = `- [Application Access](application-access/application-access.mdx): Guides related to Application Access`;

  const vol = Volume.fromJSON({
    "/docs/home.mdx": `---
title: Documentation Home
description: Guides for setting up the product.
---

Guides for setting up the product.

`,
    "/docs/application-access/application-access.mdx": `---
title: "Application Access"
description: "Guides related to Application Access"
---

`,
    "/docs/application-access/page1.mdx": `---
title: "Application Access Page 1"
description: "Protecting App 1 with Teleport"
---`,
    "/docs/application-access/page2.mdx": `---
title: "Application Access Page 2"
description: "Protecting App 2 with Teleport"
---`,
  });
  const fs = createFsFromVolume(vol);
  const actual = getTOC("/docs/home.mdx", fs);
  assert.equal(actual.result, expected);
});

Suite("getTOC with multiple links to directories", () => {
  const expected = `- [Application Access](application-access/application-access.mdx): Guides related to Application Access
- [Database Access](database-access/database-access.mdx): Guides related to Database Access.`;

  const vol = Volume.fromJSON({
    "/docs/home.mdx": `---
title: "Documentation Home"
description: "Guides to setting up the product."
---

Guides to setting up the product.

`,
    "/docs/database-access/database-access.mdx": `---
title: "Database Access"
description: Guides related to Database Access.
---

Guides related to Database Access.

`,
    "/docs/database-access/page1.mdx": `---
title: "Database Access Page 1"
description: "Protecting DB 1 with Teleport"
---`,
    "/docs/database-access/page2.mdx": `---
title: "Database Access Page 2"
description: "Protecting DB 2 with Teleport"
---`,
    "/docs/application-access/application-access.mdx": `---
title: "Application Access"
description: "Guides related to Application Access"
---

Guides related to Application Access.

`,
    "/docs/application-access/page1.mdx": `---
title: "Application Access Page 1"
description: "Protecting App 1 with Teleport"
---`,
    "/docs/application-access/page2.mdx": `---
title: "Application Access Page 2"
description: "Protecting App 2 with Teleport"
---`,
  });
  const fs = createFsFromVolume(vol);
  const actual = getTOC("/docs/home.mdx", fs);
  assert.equal(actual.result, expected);
});

Suite("getTOC orders sections correctly", () => {
  const expected = `- [API Usage](api.mdx): Using the API.
- [Application Access](application-access/application-access.mdx): Guides related to Application Access
- [Desktop Access](desktop-access/desktop-access.mdx): Guides related to Desktop Access
- [Initial Setup](initial-setup.mdx): How to set up the product for the first time.
- [Kubernetes](kubernetes.mdx): A guide related to Kubernetes.`;

  const vol = Volume.fromJSON({
    "/docs/home.mdx": `---
title: Documentation Home
description: Guides to setting up the product.
---

Guides to setting up the product.

`,
    "/docs/desktop-access/desktop-access.mdx": `---
title: "Desktop Access"
description: "Guides related to Desktop Access"
---

`,

    "/docs/application-access/application-access.mdx": `---
title: "Application Access"
description: "Guides related to Application Access"
---

`,
    "/docs/desktop-access/get-started.mdx": `---
title: "Get Started"
description: "Get started with desktop access."
---`,
    "/docs/application-access/page1.mdx": `---
title: "Application Access Page 1"
description: "Protecting App 1 with Teleport"
---`,
    "/docs/kubernetes.mdx": `---
title: "Kubernetes"
description: "A guide related to Kubernetes."
---`,

    "/docs/initial-setup.mdx": `---
title: "Initial Setup"
description: "How to set up the product for the first time."
---`,
    "/docs/api.mdx": `---
title: "API Usage"
description: "Using the API."
---`,
  });
  const fs = createFsFromVolume(vol);
  const actual = getTOC("/docs/home.mdx", fs);
  assert.equal(actual.result, expected);
});

const transformer = (vfileOptions: VFileOptions) => {
  const file = new VFile(vfileOptions);

  return remark()
    .use(remarkMdx)
    .use(remarkGFM)
    .use(remarkTOC)
    .processSync(file);
};

Suite("replaces inclusion expressions", () => {
  const sourcePath = "server/fixtures/toc/database-access/source.mdx";
  const value = readFileSync(resolve(sourcePath), "utf-8");

  const result = transformer({
    value,
    path: sourcePath,
  });

  const actual = result.toString();

  const expected = readFileSync(
    resolve("server/fixtures/toc/expected.mdx"),
    "utf-8"
  );

  assert.equal(result.messages, []);
  assert.equal(actual, expected);
});

Suite.run();
