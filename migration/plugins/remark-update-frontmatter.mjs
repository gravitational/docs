/*
 * Adds version info to frontmatter
 */

import { visit } from "unist-util-visit";

const isYamlNode = (node) => node.type === "yaml";

export default function remarkUpdateFrontmatter({ version } = {}) {
  return (root) => {
    visit(root, isYamlNode, (node) => {
      node.value = `${node.value}\nversion: '${version}'`;
    });
  };
}
