import { suite } from "uvu";
import * as os from "node:os";
import { resolve } from "path";
import * as assert from "uvu/assert";
import { transformToAST } from "../server/markdown-config";
import { VFile } from "vfile";

// TODO: Remove writeFileSync after finishing testing
import { readFileSync, writeFileSync } from "fs";

const Suite = suite("server/markdown-config");

Suite.only(
  "Does not tamper with the expected Markdown AST when including partials",
  async () => {
    const value = [
      `<Tabs>
<TabItem label="option 1">`,
      "```code",
      "$ echo 'hello world';",
      "```",
      `
<Admonition type="warning">
  This is something bad that could happen.
</Admonition>

</TabItem>
</Tabs>
`,
    ].join("\n");

    let AST1 = await transformToAST(
      value,
      new VFile({
        value: value,
        path: "/content/4.0/docs/pages/filename.mdx",
      }),
      {
        versionRootPath: "server/fixtures/includes",
        variables: {},
        staticPath: os.tmpdir(),
        staticDestinationDir: os.tmpdir(),
      }
    );

    const value2 = readFileSync(
      resolve("server/fixtures/include-code-admonition.mdx"),
      "utf-8"
    );

    const AST2 = await transformToAST(
      value2,
      new VFile({
        value: value2,
        path: "/content/4.0/docs/pages/filename.mdx",
      }),
      {
        versionRootPath: "server/fixtures/includes",
        variables: {},
        staticPath: os.tmpdir(),
        staticDestinationDir: os.tmpdir(),
      }
    );

    // TODO: These two calls are for temporary debugging. Remove them after
    // finishing testing
    writeFileSync("ast1.json", JSON.stringify(AST1, null, 4));
    writeFileSync("ast2.json", JSON.stringify(AST2, null, 4));

    console.log("AST1", AST1);
    console.log("AST2", AST2);

    assert.equal(AST1, AST2);
  }
);

Suite.run();
