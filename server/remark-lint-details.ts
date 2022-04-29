import { lintRule } from "unified-lint-rule";
import { visit } from "unist-util-visit";
import type { MdxastNode, MdxJsxFlowElement } from "./types-unist";

const isDetailsSection = (node: MdxastNode): node is MdxJsxFlowElement =>
  node.type === "mdxJsxFlowElement" && node.name === "Details";

const remarkLintDetails = lintRule(
  {
    origin: "remark-lint:details",
    url: "",
  },
  (tree, file) => {
    visit(tree, isDetailsSection, (node: MdxJsxFlowElement) => {
      if (
        !node.attributes ||
        !node.attributes.some((elem) => elem.name === "title")
      ) {
        file.fail(
          "Expected the 'title' prop in the Details component is missing"
        );
      }
    });
  }
);

export default remarkLintDetails;
