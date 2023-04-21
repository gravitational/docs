import { suite } from "uvu";
import * as assert from "uvu/assert";

import { VFile, VFileOptions } from "vfile";
import { readFileSync } from "fs";
import { resolve } from "path";
import { remark } from "remark";
import remarkMdx from "remark-mdx";
import remarkGFM from "remark-gfm";
import remarkIncludes, {
  ParameterAssignments,
  RemarkIncludesOptions,
  parsePartialParams,
  parseParamDefaults,
  resolveParamValue,
} from "../server/remark-includes";

import {
  remarkLintMessaging,
  RemarkLintMessagingOptions,
  PageLocation,
} from "../server/remark-lint-messaging";
import remarkFrontmatter from "remark-frontmatter";

const config: RemarkLintMessagingOptions = [
  {
    incorrect: "auth and proxy",
    correct: 'use "Auth and Proxy Services" instead',
    explanation: "You must capitalize product names",
  },
  {
    incorrect: "Kubernetes Access",
    correct: 'use "registering a Kubernetes cluster" instead',
    explanation:
      "Focus our messaging on a single product, rather than multiple",
  },
  {
    incorrect: "machine id|auth service|database service",
    correct: "capitalize the names of Teleport services",
    explanation:
      "See our Core Concepts page: https://goteleport.com/docs/core-concepts",
  },
];

const transformer = (vfileOptions: VFileOptions): VFile => {
  const file = new VFile(vfileOptions);

  return remark()
    .use(remarkMdx)
    .use(remarkFrontmatter)
    .use(remarkLintMessaging, config)
    .processSync(file);
};

const transformerWithConfig = (
  vfileOptions: VFileOptions,
  conf: RemarkLintMessagingOptions
): VFile => {
  const file = new VFile(vfileOptions);

  return remark()
    .use(remarkMdx)
    .use(remarkFrontmatter)
    .use(remarkLintMessaging, conf)
    .processSync(file);
};

const getErrors = (result: VFile) => {
  if (result.messages === undefined || result.messages.length == 0) {
    return [];
  }
  return result.messages.map(({ message }) => message);
};

const Suite = suite("server/remark-messaging");

Suite("Lint incorrect messaging in a paragraph", () => {
  const value = `---
title: "Getting Started"
description: "How to get started"
---

This is a paragraph that talks about the auth and proxy services. You should
install these services when getting started with Teleport.
`;
  const result = transformer({
    value,
    path: "/content/4.0/docs/pages/filename.mdx",
  });

  const expectedErrors = [
    'Incorrect messaging: "auth and proxy" (in body text). ' +
      'You must capitalize product names. You should use "Auth and Proxy Services" instead. ' +
      'Add "{/*lint ignore messaging*/}" above this line to bypass the linter.',
  ];

  assert.equal(getErrors(result), expectedErrors);
});

Suite("Lint incorrect messaging in a header", () => {
  const value = `---
title: "Access Kubernetes"
description: "How to get started accessing Kubernetes."
---

In this guide, we will explain how to set up Teleport to access Kubernetes.

## Step 1/1. Enable Kubernetes Access
`;
  const expectedErrors = [
    'Incorrect messaging: "Kubernetes Access" (in header). Focus our messaging ' +
      "on a single product, rather than multiple. You should use " +
      '"registering a Kubernetes cluster" instead. ' +
      'Add "{/*lint ignore messaging*/}" above this line to bypass the linter.',
  ];

  const result = transformer({
    value,
    path: "/content/4.0/docs/pages/filename.mdx",
  });

  assert.equal(getErrors(result), expectedErrors);
});

Suite("Lint incorrect messaging in a title", () => {
  const value = `---
title: "Get Started with Kubernetes Access"
description: "How to get started accessing Kubernetes."
---

In this guide, we will explain how to set up Teleport to access Kubernetes.

## Step 1/1. Enable the Kubernetes Service
`;

  const expectedErrors = [
    'Incorrect messaging: "Kubernetes Access" (in title). Focus our messaging ' +
      "on a single product, rather than multiple. You should use " +
      '"registering a Kubernetes cluster" instead. Add "{/*lint ignore messaging*/}" ' +
      "above this line to bypass the linter.",
  ];

  const result = transformer({
    value,
    path: "/content/4.0/docs/pages/filename.mdx",
  });

  assert.equal(getErrors(result), expectedErrors);
});

Suite("Lint incorrect messaging in a code comment", () => {
  const value = `---
title: "Getting Started"
description: "How to get started"
---

Here is a YAML document:

\`\`\`yaml
# You can use this YAML to configure the auth and 
# proxy.
version: v3
\`\`\`

Here is a JS code fence:

\`\`\`js
/*
 * You can use this YAML to configure Kubernetes Access
*/
function myfunc(string){
\`\`\`

Here is a Go code fence:

\`\`\`go
// Here is something for configuring machine 
// id
func myfunc(s string){
\`\`\`

`;
  const result = transformer({
    value,
    path: "/content/4.0/docs/pages/filename.mdx",
  });

  const expectedErrors = [
    'Incorrect messaging: "auth and proxy" (in code comment). You must capitalize product ' +
      'names. You should use "Auth and Proxy Services" instead. ' +
      'Add "{/*lint ignore messaging*/}" above this line to bypass the linter.',
    'Incorrect messaging: "Kubernetes Access" (in code comment). Focus our messaging on a ' +
      'single product, rather than multiple. You should use "registering a ' +
      'Kubernetes cluster" instead. ' +
      'Add "{/*lint ignore messaging*/}" above this line to bypass the linter.',
    'Incorrect messaging: "machine id" (in code comment). See our Core Concepts page: ' +
      "https://goteleport.com/docs/core-concepts. " +
      "You should capitalize the names of Teleport services. " +
      'Add "{/*lint ignore messaging*/}" above this line to bypass the linter.',
  ];

  assert.equal(getErrors(result), expectedErrors);
});

Suite("Allow ignoring incorrect usage in the title", () => {
  const value = `---
title: "Getting Started with the auth and proxy"
description: "How to get started"
---
`;
  const result = transformerWithConfig(
    {
      value,
      path: "/content/4.0/docs/pages/filename.mdx",
    },
    [
      {
        incorrect: "auth and proxy",
        correct: 'use "Auth and Proxy Services" instead',
        explanation: "You must capitalize product names",
        where: [
          PageLocation.Description,
          PageLocation.Headers,
          PageLocation.Body,
          PageLocation.Comments,
        ],
      },
    ]
  );

  const expectedErrors = [];

  assert.equal(getErrors(result), expectedErrors);
});

Suite("Allow ignoring incorrect usage in the description", () => {
  const value = `---
title: "Getting Started with the Auth and Proxy"
description: "How to get started with the auth and proxy"
---
`;
  const result = transformerWithConfig(
    {
      value,
      path: "/content/4.0/docs/pages/filename.mdx",
    },
    [
      {
        incorrect: "auth and proxy",
        correct: 'use "Auth and Proxy Services" instead',
        explanation: "You must capitalize product names",
        where: [
          PageLocation.Title,
          PageLocation.Headers,
          PageLocation.Body,
          PageLocation.Comments,
        ],
      },
    ]
  );

  const expectedErrors = [];

  assert.equal(getErrors(result), expectedErrors);
});

Suite("Allow ignoring incorrect usage in headers", () => {
  const value = `---
title: "Getting Started with the Auth and Proxy"
description: "How to get started with the Auth and Proxy"
---

## Introducing the auth and proxy
`;
  const result = transformerWithConfig(
    {
      value,
      path: "/content/4.0/docs/pages/filename.mdx",
    },
    [
      {
        incorrect: "auth and proxy",
        correct: 'use "Auth and Proxy Services" instead',
        explanation: "You must capitalize product names",
        where: [
          PageLocation.Title,
          PageLocation.Description,
          PageLocation.Body,
          PageLocation.Comments,
        ],
      },
    ]
  );

  const expectedErrors = [];

  assert.equal(getErrors(result), expectedErrors);
});

Suite("Allow ignoring incorrect usage in the the body text", () => {
  const value = `---
title: "Getting Started with the Auth and Proxy"
description: "How to get started with the Auth and Proxy"
---

This is text about the auth and proxy.
`;
  const result = transformerWithConfig(
    {
      value,
      path: "/content/4.0/docs/pages/filename.mdx",
    },
    [
      {
        incorrect: "auth and proxy",
        correct: 'use "Auth and Proxy Services" instead',
        explanation: "You must capitalize product names",
        where: [
          PageLocation.Title,
          PageLocation.Description,
          PageLocation.Headers,
          PageLocation.Comments,
        ],
      },
    ]
  );

  const expectedErrors = [];

  assert.equal(getErrors(result), expectedErrors);
});

Suite("Allow ignoring incorrect usage in comments", () => {
  const value = `---
title: "Getting Started"
description: "How to get started"
---

Here is a YAML document:

\`\`\`yaml
# You can use this YAML to configure the auth and 
# proxy.
version: v3
\`\`\`

`;
  const result = transformerWithConfig(
    {
      value,
      path: "/content/4.0/docs/pages/filename.mdx",
    },
    [
      {
        incorrect: "auth and proxy",
        correct: 'use "Auth and Proxy Services" instead',
        explanation: "You must capitalize product names",
        where: [
          PageLocation.Title,
          PageLocation.Description,
          PageLocation.Headers,
          PageLocation.Body,
        ],
      },
    ]
  );

  const expectedErrors = [];

  assert.equal(getErrors(result), expectedErrors);
});

const transformerWithIncludes = (
  vfileOptions: VFileOptions,
  pluginOptions: RemarkIncludesOptions = { resolve: true }
) => {
  const file = new VFile(vfileOptions);

  return remark()
    .use(remarkMdx)
    .use(remarkGFM)
    .use(remarkIncludes, {
      rootDir: "server/fixtures/includes/",
      ...pluginOptions,
    })
    .use(remarkLintMessaging, config)
    .processSync(file);
};

Suite.only("Lints messaging in includes correctly", () => {
  const value = `This is an including file.

There is a messaging violation on the final line:

(!include-bad-messaging.mdx!)
`;
  const result = transformerWithIncludes(
    {
      value,
      path: "/content/4.0/docs/pages/filename.mdx",
    },
    { lint: true, resolve: true }
  );

  assert.equal(result.messages[0].line, 7);
});

Suite.run();
