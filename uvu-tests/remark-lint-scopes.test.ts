import { suite } from "uvu";
import { VFile, VFileOptions } from "vfile";
import remarkMdx from "remark-mdx";
import { remark } from "remark";
import { remarkLintScopes } from "../server/remark-lint-scopes";
import * as assert from "uvu/assert";

const Suite = suite("server/remark-lint-scopes");

const transformer = (vfileOptions: VFileOptions, scopes: string[]): VFile => {
  const file = new VFile(vfileOptions);

  return remark()
    .use(remarkMdx)
    .use(remarkLintScopes, scopes)
    .processSync(file);
};

const getErrors = (result: VFile) => {
  if (result.messages === undefined || result.messages.length == 0) {
    return [];
  }
  return result.messages.map(({ message }) => message);
};

Suite("returns no errors on a Tabs component with all scopes", () => {
  const value = `
This is a paragraph.

<Tabs>
<TabItem scope={["cloud", "team"]}>
These instructions apply to Enterprise Cloud and Team.
</TabItem>
<TabItem scope="enterprise">
These instructions apply to Enterprise.
</TabItem>
<TabItem scope="oss">
These instructions apply to OSS.
</TabItem>
</Tabs>
`;
  const result = transformer(
    {
      value,
      path: "/content/4.0/docs/pages/filename.mdx",
    },
    ["oss", "team", "cloud", "enterprise"]
  );

  const expectedErrors = [];

  assert.equal(getErrors(result), expectedErrors);
});

Suite("returns no errors on a Tabs component with no scopes", () => {
  const value = `
This is a paragraph.

<Tabs>
<TabItem label="label1">
These instructions apply to Enterprise Cloud and Team.
</TabItem>
<TabItem label="label2">
These instructions apply to Enterprise.
</TabItem>
<TabItem label="label3">
These instructions apply to OSS.
</TabItem>
</Tabs>
`;
  const result = transformer(
    {
      value,
      path: "/content/4.0/docs/pages/filename.mdx",
    },
    ["oss", "team", "cloud", "enterprise"]
  );

  const expectedErrors = [];

  assert.equal(getErrors(result), expectedErrors);
});
Suite("returns no errors on a valid non-Tabs scoped component", () => {
  const value = `
This is a paragraph.

<ScopedComponent scope="team" />

<ScopedComponent scope="enterprise" />
`;
  const result = transformer(
    {
      value,
      path: "/content/4.0/docs/pages/filename.mdx",
    },
    ["oss", "team", "cloud", "enterprise"]
  );

  const expectedErrors = [];

  assert.equal(getErrors(result), expectedErrors);
});

Suite("catches Tabs components with missing scopes", () => {
  const value = `
This is a paragraph.

<Tabs>
<TabItem scope={["team", "cloud"]}>
These instructions apply to Enterprise Cloud and Team.
</TabItem>
<TabItem scope="enterprise">
These instructions apply to Enterprise.
</TabItem>
</Tabs>
`;
  const result = transformer(
    {
      value,
      path: "/content/4.0/docs/pages/filename.mdx",
    },
    ["oss", "team", "cloud", "enterprise", "free"]
  );

  const expectedErrors = [
    'The page is configured for scopes "oss,team,cloud,enterprise,free", but the "oss" scope is missing from a Tabs component. Either fix the Tabs component or adjust the forScopes setting for the page in docs/config.json.',
    'The page is configured for scopes "oss,team,cloud,enterprise,free", but the "free" scope is missing from a Tabs component. Either fix the Tabs component or adjust the forScopes setting for the page in docs/config.json.',
  ];

  assert.equal(getErrors(result), expectedErrors);
});

Suite("catches Tabs components with an excess scope", () => {
  const value = `
This is a paragraph.

<Tabs>
<TabItem scope={["oss", "team"]}>
These instructions apply to Enterprise Cloud and Team.
</TabItem>
<TabItem scope="free">
These instructions apply to OSS.
</TabItem>
</Tabs>
`;
  const result = transformer(
    {
      value,
      path: "/content/4.0/docs/pages/filename.mdx",
    },
    ["oss", "team"]
  );

  const expectedErrors = [
    'The page is configured for scopes "oss,team", but the TabItem component supports the "free" scope. Either fix the TabItem component or adjust the forScopes setting for the page in docs/config.json.',
  ];

  assert.equal(getErrors(result), expectedErrors);
});

// Note that there's currently no intention of catching non-Tabs scoped
// components with missing scopes, since it's non-trivial to determine what
// constitutes the range of components in which a scope is "missing". If a page
// includes a ScopedBlock for "enterprise", for example, it's
// difficult/impossible to determine if the page should also include
// ScopedBlocks for "cloud", "oss", and "team".
Suite("catches non-Tabs scoped components with an excess scope", () => {
  const value = `
This is a paragraph.

<ScopedComponent scope={["cloud", "free"]} />
`;
  const result = transformer(
    {
      value,
      path: "/content/4.0/docs/pages/filename.mdx",
    },
    ["oss", "cloud"]
  );

  const expectedErrors = [
    'The page is configured for scopes "oss,cloud", but the ScopedComponent component supports the "free" scope. Either fix the ScopedComponent component or adjust the forScopes setting for the page in docs/config.json.',
  ];

  assert.equal(getErrors(result), expectedErrors);
});

Suite.run();
