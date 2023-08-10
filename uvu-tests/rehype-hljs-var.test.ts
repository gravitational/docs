import { suite } from "uvu";
import * as assert from "uvu/assert";

import rehypeMdxToHast from "../server/rehype-mdx-to-hast";
import { VFile, VFileOptions } from "vfile";
import { remark } from "remark";
import { readFileSync } from "fs";
import { resolve } from "path";
import mdx from "remark-mdx";
import { rehypeVarInHLJS } from "../server/rehype-hljs-var";
import { unified } from "unified";
import remarkRehype from "remark-rehype";
import remarkParse from "remark-parse";
import rehypeStringify from "rehype-stringify";
import { definer as hcl } from "highlightjs-terraform";

const Suite = suite("server/remark-hljs-var");

const transformer = (options: VFileOptions) =>
  // TODO: The configuration below includes a subset of the processors found in
  // transformToAST (server/markdown-config.ts). Extract this into a separate
  // function to avoid drift in how we use rehype.
  unified()
    .use(remarkParse)
    .use(mdx)
    .use(remarkRehype, {
      passThrough: [
        "mdxFlowExpression",
        "mdxJsxFlowElement",
        "mdxJsxTextElement",
        "mdxTextExpression",
        "mdxjsEsm",
      ], // passThrough options says transformer which nodes to leave as is
    }) // Transforms remark to rehype
    .use(rehypeVarInHLJS, {
      languages: { hcl: hcl },
    })
    .use(rehypeMdxToHast)
    // rehypeStringify is not used in transformToAST. We use it to generate
    // human-readable test output.
    .use(rehypeStringify)
    .processSync(new VFile(options));

Suite("Insert Var components as HTML nodes: Var gets its own hljs span", () => {
  const result = transformer({
    value: readFileSync(
      resolve("server/fixtures/yaml-snippet-var.mdx"),
      "utf-8"
    ),
    path: "/docs/index.mdx",
  });

  // Note that, because of rehypeMdxToHast, the <Var> components ending up
  // having the <var> tag. The MDX configuration in the DocsPage layout maps
  // this to Var.
  assert.equal(
    (result.value as string).trim(),
    readFileSync(
      resolve("server/fixtures/result/yaml-snippet-var.html"),
      "utf-8"
    ).trim()
  );
});

Suite(
  "Insert Var components as HTML nodes: Var part of a broader span in go",
  () => {
    const result = transformer({
      value: readFileSync(
        resolve("server/fixtures/go-comment-var.mdx"),
        "utf-8"
      ),
      path: "/docs/index.mdx",
    });

    assert.equal(
      (result.value as string).trim(),
      readFileSync(
        resolve("server/fixtures/result/go-comment-var.html"),
        "utf-8"
      ).trim()
    );
  }
);

Suite(
  "Insert Var components as HTML nodes: Var part of a broader span in YAML",
  () => {
    const result = transformer({
      value: readFileSync(
        resolve("server/fixtures/yaml-comment-vars.mdx"),
        "utf-8"
      ),
      path: "/docs/index.mdx",
    });

    assert.equal(
      (result.value as string).trim(),
      readFileSync(
        resolve("server/fixtures/result/yaml-comment-vars.html"),
        "utf-8"
      ).trim()
    );
  }
);

Suite("Insert Var components as HTML nodes: text after a Var", () => {
  const result = transformer({
    value: readFileSync(resolve("server/fixtures/hcl-vars.mdx"), "utf-8"),
    path: "/docs/index.mdx",
  });

  assert.equal(
    (result.value as string).trim(),
    readFileSync(
      resolve("server/fixtures/result/hcl-vars.html"),
      "utf-8"
    ).trim()
  );
});

Suite("Ignore VarList in code snippet components", () => {
  // This throws if the plugin interprets VarList components as being Vars.
  transformer({
    value: readFileSync(resolve("server/fixtures/varlist.mdx"), "utf-8"),
    path: "/docs/index.mdx",
  });
});

Suite.run();
