import { suite } from "uvu";
import * as assert from "uvu/assert";
import { transformToAST } from "../server/markdown-config";
import { VFile, VFileOptions } from "vfile";
import { createElement } from "react";
import rehypeReact from "rehype-react";
import { components } from "layouts/DocsPage/components";
import Layout from "layouts/DocsPage";
import { render, screen } from "@testing-library/react";

val = `<Tabs dropDownCaption="My Tabs!">
<TabItem options="Option1" label="Open Source">

This is the tab.

</TabItem>
<TabItem options="Option2" label="Open Source">

This is the tab.

</TabItem>
</Tabs>`;

const renderAst = new rehypeReact({
  createElement,
  components,
}).Compiler;

const Suite = suite("server/tabs");

Suite.only("Sample test with Tabs", async (done) => {
  const file = new VFile();
  await transformToAST(val, file);

  render(
    <Layout meta={undefined} tableOfContents={undefined}>
      {renderAst(AST)}
    </Layout>
  );
  done();
});
