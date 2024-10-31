import { Redirect } from "next/dist/lib/load-custom-routes";
import { suite } from "uvu";
import * as assert from "uvu/assert";
import {
  Config,
  checkURLsForCorrespondingFiles,
  checkForRedirectsFromExistingFiles,
  checkDuplicateRedirects,
} from "../server/config-docs";
import { generateNavPaths } from "../server/pages-helpers";
import { randomUUID } from "crypto";
import { join } from "path";
import { Volume, createFsFromVolume } from "memfs";
import type { Redirect } from "next/dist/lib/load-custom-routes";

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
          title: "Database RBAC Reference",
          slug: "/database-access/rbac/reference/",
        },
        {
          title: "Get Started with DB RBAC",
          slug: "/database-access/rbac/get-started/",
        },
      ],
    },
    {
      title: "Protect Databases with Teleport",
      slug: "/database-access/introduction/",
    },
  ];

  const vol = Volume.fromJSON(files);
  const fs = createFsFromVolume(vol);
  const actual = generateNavPaths(fs, "/docs/pages/database-access");
  assert.equal(actual, expected);
});

Suite(
  "generateNavPaths alphabetizes second-level links except 'Introduction'",
  () => {
    const files = {
      "/docs/pages/database-access/mongodb.mdx": `---
title: MongoDB 
---`,
      "/docs/pages/database-access/azure-dbs.mdx": `---
title: Azure
---`,
      "/docs/pages/database-access/introduction.mdx": `---
title: Introduction to Database Access
---`,
    };

    const expected = [
      {
        title: "Introduction to Database Access",
        slug: "/database-access/introduction/",
      },
      {
        title: "Azure",
        slug: "/database-access/azure-dbs/",
      },
      {
        title: "MongoDB",
        slug: "/database-access/mongodb/",
      },
    ];

    const vol = Volume.fromJSON(files);
    const fs = createFsFromVolume(vol);
    const actual = generateNavPaths(fs, "/docs/pages/database-access");
    assert.equal(actual, expected);
  }
);

Suite(
  "generateNavPaths alphabetizes third-level links except 'Introduction'",
  () => {
    const files = {
      "/docs/pages/database-access/guides/guides.mdx": `---
title: Database Access Guides
---`,
      "/docs/pages/database-access/guides/postgres.mdx": `---
title: Postgres Guide
---`,
      "/docs/pages/database-access/guides/mysql.mdx": `---
title: MySQL Guide
---`,
      "/docs/pages/database-access/guides/get-started.mdx": `---
title: Introduction to Database RBAC
---`,
      "/docs/pages/database-access/guides/reference.mdx": `---
title: Database RBAC Reference
---`,
    };

    const expected = [
      {
        title: "Database Access Guides",
        slug: "/database-access/guides/guides/",
        entries: [
          {
            title: "Introduction to Database RBAC",
            slug: "/database-access/guides/get-started/",
          },
          {
            title: "Database RBAC Reference",
            slug: "/database-access/guides/reference/",
          },
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
    ];

    const vol = Volume.fromJSON(files);
    const fs = createFsFromVolume(vol);
    const actual = generateNavPaths(fs, "/docs/pages/database-access");
    assert.equal(actual, expected);
  }
);

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

Suite(
  "generateNavPaths throws if there is a category page at an incorrect location",
  () => {
    const files = {
      "/docs/pages/database-access/guides/postgres.mdx": `---
title: Postgres Guide
---`,
      "/docs/pages/database-access/guides/mysql.mdx": `---
title: MySQL Guide
---`,
      "/docs/pages/database-access/guides.mdx": `---
title: "Database Access Guides"
---`,
    };

    const vol = Volume.fromJSON(files);
    const fs = createFsFromVolume(vol);
    assert.throws(() => {
      generateNavPaths(fs, "/docs/pages/database-access");
    }, "database-access/guides/guides.mdx");
  }
);

Suite("generateNavPaths shows third-level pages on the sidebar", () => {
  const files = {
    "/docs/pages/database-access/guides/guides.mdx": `---
title: Database Access Guides
---`,
    "/docs/pages/database-access/guides/postgres.mdx": `---
title: Postgres Guide
---`,
    "/docs/pages/database-access/guides/mysql.mdx": `---
title: MySQL Guide
---`,
    "/docs/pages/database-access/guides/rbac/rbac.mdx": `---
title: Database Access RBAC
---`,
    "/docs/pages/database-access/guides/rbac/get-started.mdx": `---
title: Get Started with DB RBAC
---`,
  };

  const expected = [
    {
      title: "Database Access Guides",
      slug: "/database-access/guides/guides/",
      entries: [
        {
          title: "Database Access RBAC",
          slug: "/database-access/guides/rbac/rbac/",
          entries: [
            {
              title: "Get Started with DB RBAC",
              slug: "/database-access/guides/rbac/get-started/",
            },
          ],
        },
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
  ];

  const vol = Volume.fromJSON(files);
  const fs = createFsFromVolume(vol);
  const actual = generateNavPaths(fs, "/docs/pages/database-access");
  assert.equal(actual, expected);
});

Suite("generates four levels of the sidebar", () => {
  const files = {
    "/docs/pages/database-access/guides/guides.mdx": `---
title: Database Access Guides
---`,
    "/docs/pages/database-access/guides/deployment/kubernetes.mdx": `---
title: Database Access Kubernetes Deployment
---`,
    "/docs/pages/database-access/guides/deployment/deployment.mdx": `---
title: Database Access Deployment Guides
---`,
  };

  const expected = [
    {
      title: "Database Access Guides",
      slug: "/database-access/guides/guides/",
      entries: [
        {
          title: "Database Access Deployment Guides",
          slug: "/database-access/guides/deployment/deployment/",
          entries: [
            {
              title: "Database Access Kubernetes Deployment",
              slug: "/database-access/guides/deployment/kubernetes/",
            },
          ],
        },
      ],
    },
  ];

  const vol = Volume.fromJSON(files);
  const fs = createFsFromVolume(vol);
  let actual = generateNavPaths(fs, "/docs/pages/database-access");
  assert.equal(actual, expected);
});

Suite("page named after directory at two possible dir levels", () => {
  const files = {
    "/docs/pages/database-access/deployment/deployment.mdx": `---
title: Database Access Deployment Guides
---`,
    "/docs/pages/database-access/deployment.mdx": `---
title: Deploying the Database Service
---`,
    "/docs/pages/database-access/deployment/kubernetex.mdx": `---
title: Deploying the Database Service on Kubernetes
---`,
  };

  const vol = Volume.fromJSON(files);
  const fs = createFsFromVolume(vol);
  assert.throws(
    () => {
      const actual = generateNavPaths(fs, "/docs/pages/database-access");
    },
    "database-access/deployment/deployment.mdx",
    "database-access/deployment.mdx"
  );
});

Suite("Checks for duplicate redirects", () => {
  const redirects: Array<Redirect> = [
    {
      source: "/getting-started/",
      destination: "/get-started/",
      permanent: true,
    },
    {
      source: "/getting-started/",
      destination: "/get-started/",
      permanent: true,
    },
    {
      source: "/application-access/",
      destination: "/connecting-apps/",
      permanent: true,
    },
    {
      source: "/application-access/",
      destination: "/connecting-apps/",
      permanent: true,
    },
    {
      source: "/database-access/",
      destination: "/connecting-databases/",
      permanent: true,
    },
  ];

  const expected: Array<Redirect> = [
    {
      source: "/getting-started/",
      destination: "/get-started/",
      permanent: true,
    },
    {
      source: "/application-access/",
      destination: "/connecting-apps/",
      permanent: true,
    },
  ];

  const actual = checkDuplicateRedirects(redirects);
  assert.equal(actual, expected);
});

Suite("Checks for redirects from existing paths", () => {
  const redirects: Array<Redirect> = [
    {
      source: "/contact/offices/",
      destination: "/get-in-touch/offices/",
      permanent: true,
    },
    {
      source: "/locations/",
      destination: "/contact/offices/",
      permanent: true,
    },
    {
      source: "/about/projects/project1/",
      destination: "/project1/",
      permanent: true,
    },
  ];

  const expected: Array<Redirect> = [
    {
      source: "/contact/offices/",
      destination: "/get-in-touch/offices/",
      permanent: true,
    },
    {
      source: "/about/projects/project1/",
      destination: "/project1/",
      permanent: true,
    },
  ];

  const actual = checkForRedirectsFromExistingFiles(
    join("server", "fixtures", "fake-content"),
    redirects
  );
  assert.equal(actual, expected);
});

Suite.run();
