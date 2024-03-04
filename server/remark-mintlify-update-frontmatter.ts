/*
 * Adds version info to frontmatter
 */

import { visit } from "unist-util-visit";
import type { Transformer } from "unified";
import type { Node } from "unist";
import type { YamlNode } from "./types-unist";

const isYamlNode = (node: Node): node is YamlNode => node.type === "yaml";

export type PluginOptions = {
  version?: string;
};

export default function remarkMintlifyUpdateFrontmatter({
  version,
}: PluginOptions = {}): Transformer {
  return (root) => {
    visit(root, isYamlNode, (node: YamlNode) => {
      node.value = `${node.value}\nversion: "${version}"`;
    });
  };
}
