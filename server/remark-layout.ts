/*
 * This plugin injects page wrapper component based on the value on `layout` field in frontmatter.
 * All fronmatter fields except `layout` and privded to the wrapper component as `meta` prop.
 */

import type { Transformer } from "unified";
import type { VFile } from "vfile";
import type { Node as UnistNode, Parent as UnistParent } from "unist";

import yaml from "js-yaml";
import stringifyObject from "stringify-object";
import find from "unist-util-find";
import { createMdxjsEsmNode } from "./mdx-helpers";

type Meta = Record<string, unknown>;
type ImportTemplate = (layoutPath: string) => string;
type ExportTemplate = (metaKey: string) => string;
type MetaProcessor = (meta: Meta, vfile: VFile) => Promise<Meta>;

interface LayoutOptions {
  path: string;
  metaProcessor?: MetaProcessor;
  importTemplate?: ImportTemplate;
  exportTemplate?: ExportTemplate;
}

interface RemarkLayoutOptions {
  layouts?: Record<string, string | LayoutOptions>;
  defaultLayout?: string | LayoutOptions;
  defaultImportTemplate?: ImportTemplate;
  defaultExportTemplate?: ExportTemplate;
  metaKey?: string;
  defaultMetaProcessor?: MetaProcessor;
}

const importTemplatePlaceholder: ImportTemplate = (layoutPath: string) =>
  `import Layout from "${layoutPath}";`;

const exportTemplatePlacehoder: ExportTemplate = (metaKey) => `
export default function Wrapper (props) {
  return <Layout {...props} ${metaKey}={${metaKey}} />;
};
`;

const metaProcessorPlaceholder: MetaProcessor = (meta) => Promise.resolve(meta);

export default function remarkLayout({
  layouts = {},
  defaultLayout,
  defaultImportTemplate = importTemplatePlaceholder,
  defaultExportTemplate = exportTemplatePlacehoder,
  defaultMetaProcessor = metaProcessorPlaceholder,
  metaKey = "meta",
}: RemarkLayoutOptions): Transformer {
  return async (root: UnistParent, vfile: VFile) => {
    const node = find(root, (node: UnistNode) => node.type === "yaml");

    if (!node) {
      return;
    }

    const meta = yaml.load(node.value as string) as Meta;

    const layout =
      (meta.layout && layouts[meta.layout as string]) || defaultLayout;

    if (!layout) {
      console.error(
        'Neither named layout, nor "defaultLayout" found in config.'
      );

      return;
    }

    const metaProcessor =
      typeof layout !== "string" && layout.metaProcessor
        ? layout.metaProcessor
        : defaultMetaProcessor;

    const metaValue = stringifyObject(await metaProcessor(meta, vfile));

    let path: string;
    let importTemplate: ImportTemplate = defaultImportTemplate;
    let exportTemplate: ExportTemplate = defaultExportTemplate;

    if (typeof layout === "string") {
      path = layout;
    } else {
      path = layout.path;
      importTemplate = layout.importTemplate || importTemplate;
      exportTemplate = layout.exportTemplate || exportTemplate;
    }

    root.children.unshift(createMdxjsEsmNode(importTemplate(path)));
    root.children.push(
      createMdxjsEsmNode(`export const ${metaKey} = ${metaValue};`)
    );
    root.children.push(createMdxjsEsmNode(exportTemplate(metaKey)));
  };
}
