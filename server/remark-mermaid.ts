// This plugin is heavily based on https://github.com/temando/remark-mermaid/

import { Image, Code, Root } from "mdast";
import type { Transformer } from "unified";
import type { VFile } from "vfile";
import { visit } from "unist-util-visit";
import crypto from "crypto";
import fs from "fs-extra";
import { join, relative } from "path";
import which from "which";
import { execSync } from "child_process";

const PLUGIN_NAME = "remark-mermaid";

interface PluginOptions {
  configFilePath?: string;
  destinationDir?: string;
  staticPath?: string;
}

interface RenderOptions extends PluginOptions {
  sourceDir: string;
}

function render(
  source: string,
  { sourceDir, destinationDir, staticPath, configFilePath }: RenderOptions
): string {
  const config = configFilePath ? fs.readFileSync(configFilePath, "utf-8") : "";
  const pathToImageDir = staticPath || relative(sourceDir, destinationDir);

  // make unique filename based on config and source content
  const unique = crypto
    .createHmac("sha1", PLUGIN_NAME)
    .update(config + source)
    .digest("hex");

  const mmdcExecutable = which.sync("mmdc");
  const tmpMmdFilePath = join(destinationDir, `${unique}.mmd`);
  const svgFilename = `${unique}.svg`;
  const svgFilePath = join(destinationDir, svgFilename);

  // only create file if it does not exists yet
  if (!fs.existsSync(svgFilePath)) {
    // Write temporary file
    fs.outputFileSync(tmpMmdFilePath, source);

    const command = configFilePath
      ? `${mmdcExecutable} -q  -i ${tmpMmdFilePath} -o ${svgFilePath} -b transparent --configFile ${configFilePath}`
      : `${mmdcExecutable} -q -i ${tmpMmdFilePath} -o ${svgFilePath} -b transparent`;

    // Invoke mermaid.cli
    execSync(command);

    // Clean up temporary file
    fs.removeSync(tmpMmdFilePath);
  }

  return join(pathToImageDir, svgFilename);
}

export default function remarkMermaid(
  options: PluginOptions = {}
): Transformer {
  return function transformer(ast: Root, vFile: VFile) {
    const {
      destinationDir = vFile.dirname, // by default put image at the same folder
      staticPath,
      configFilePath,
    } = options;

    visit(ast, "code", (node: Code, index, parent) => {
      const { lang, value } = node;

      if (lang === "mermaid") {
        try {
          const newNode: Image = {
            type: "image",
            url: render(value, {
              sourceDir: vFile.dirname,
              destinationDir,
              staticPath,
              configFilePath,
            }),
            alt: "",
          };

          parent.children.splice(index, 1, newNode);
        } catch (error) {
          throw new Error(error);
        }
      }
    });
  };
}
