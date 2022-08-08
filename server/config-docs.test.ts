import { Redirect } from "next/dist/lib/load-custom-routes";
import { suite } from "uvu";
import * as assert from "uvu/assert";
import { Config, checkURLsForCorrespondingFiles } from "./config-docs";
import { randomUUID } from "crypto";
import { join } from "path";
import { opendirSync } from "fs";

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

Suite.run();
