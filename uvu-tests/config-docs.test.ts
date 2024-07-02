import { Redirect } from "next/dist/lib/load-custom-routes";
import { suite } from "uvu";
import * as assert from "uvu/assert";
import { Config, checkURLsForCorrespondingFiles } from "../server/config-docs";
import { generateNavPaths } from "../server/pages-helpers";
import { randomUUID } from "crypto";
import { join } from "path";
import { Volume, createFsFromVolume } from "memfs";

const Suite = suite("server/config-docs");

Suite("Ensures that URLs correspond to docs pages", () => {
  const conf: Config = {
    navigation: [
      {
        icon: "bolt",
        title: "Home",
        entries: [
          {
            title: "Welcome",
            slug: "/",
            forScopes: ["oss"],
          },
        ],
      },
      {
        icon: "bolt",
        title: "About",
        entries: [
          {
            title: "Introduction",
            slug: "/about/",
            forScopes: ["oss"],
          },
          {
            title: "Projects",
            slug: "/about/projects/",
            forScopes: ["oss"],
            entries: [
              {
                title: "Project 1",
                slug: "/about/projects/project1/",
                forScopes: ["oss"],
              },
              {
                title: "Project 2",
                slug: "/about/projects/project2/",
                forScopes: ["oss"],
              },
              {
                title: "Project 3",
                slug: "/about/projects/project3/",
                forScopes: ["oss"],
              },
            ],
          },
          {
            title: "Team",
            slug: "/about/team/",
            forScopes: ["oss"],
          },
        ],
      },
      {
        icon: "bolt",
        title: "Contact",
        entries: [
          {
            title: "Welcome",
            slug: "/contact/",
            forScopes: ["oss"],
          },
          {
            title: "Offices",
            slug: "/contact/offices/",
            forScopes: ["oss"],
          },
        ],
      },
    ],
    redirects: [
      {
        source: "/offices/",
        destination: "/contact/offices/",
        permanent: true,
      },
      {
        source: "/project4/",
        destination: "/about/projects/project4/",
        permanent: true,
      },
      {
        source: "/project3",
        destination: "/about/projects/project3/",
        permanent: true,
      },
    ],
  };

  const actual = checkURLsForCorrespondingFiles(
    join("server", "fixtures", "fake-content"),
    conf.navigation,
    conf.redirects
  );

  const expected = [
    "/about/projects/",
    "/about/projects/project3/",
    "/contact/",
    "/about/projects/project4/",
  ];

  assert.equal(actual, expected);
});

Suite("generateNavPaths generates a sidebar from a file tree", () => {
  const files = {
    "/docs/pages/database-access/introduction.mdx": `---
title: Protect Databases with Teleport
---`,
    "/docs/pages/database-access/guides/guides.mdx": `---
title: Database Access Guides
---`,
    "/docs/pages/database-access/guides/postgres.mdx": `---
title: Postgres Guide
---`,
    "/docs/pages/database-access/guides/mysql.mdx": `---
title: MySQL Guide
---`,
    "/docs/pages/database-access/rbac/rbac.mdx": `---
title: Database Access RBAC
---`,
    "/docs/pages/database-access/rbac/get-started.mdx": `---
title: Get Started with DB RBAC
---`,
    "/docs/pages/database-access/rbac/reference.mdx": `---
title: Database RBAC Reference
---`,
  };

  const expected = [
    {
      title: "Protect Databases with Teleport",
      slug: "/database-access/introduction/",
    },
    {
      title: "Database Access Guides",
      slug: "/database-access/guides/guides/",
      entries: [
        {
          title: "MySQL Guide",
          slug: "/database-access/guides/mysql/",
        },
        {
          title: "Postgres Guide",
          slug: "/database-access/guides/postgres/",
        },
      ],
    },
    {
      title: "Database Access RBAC",
      slug: "/database-access/rbac/rbac/",
      entries: [
        {
          title: "Get Started with DB RBAC",
          slug: "/database-access/rbac/get-started/",
        },
        {
          title: "Database RBAC Reference",
          slug: "/database-access/rbac/reference/",
        },
      ],
    },
  ];

  const vol = Volume.fromJSON(files);
  const fs = createFsFromVolume(vol);
  const actual = generateNavPaths(fs, "/docs/pages/database-access");
  assert.equal(actual, expected);
});

Suite(
  "generateNavPaths throws if there is no category page in a subdirectory",
  () => {
    const files = {
      "/docs/pages/database-access/guides/postgres.mdx": `---
title: Postgres Guide
---`,
      "/docs/pages/database-access/guides/mysql.mdx": `---
title: MySQL Guide
---`,
    };

    const vol = Volume.fromJSON(files);
    const fs = createFsFromVolume(vol);
    assert.throws(() => {
      generateNavPaths(fs, "/docs/pages/database-access");
    }, "database-access/guides/guides.mdx");
  }
);

Suite.run();
