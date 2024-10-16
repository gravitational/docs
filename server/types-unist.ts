import type { VFile, VFileData } from "vfile";
import type {
  Literal as UnistLiteral,
  Node as UnistNode,
  Parent as UnistParent,
} from "unist";
import type { RootContent as MdastContent } from "mdast";
import type { Node as AcornNode } from "acorn";

export interface YamlNode extends UnistNode {
  type: "yaml";
  value: string;
}

export type MdxJsxAttributeValue =
  | boolean
  | number
  | string
  | null
  | undefined
  | Array<string | number>
  | ProgramEsmNode;

export interface MdxJsxAttribute {
  type: "mdxJsxAttribute";
  name: string;
  value: MdxJsxAttributeValue;
}

export interface MdxJsxElement extends UnistParent {
  name: string;
  attributes: MdxJsxAttribute[];
  children: MdxastNode[];
}

export interface MdxJsxFlowElement extends MdxJsxElement {
  type: "mdxJsxFlowElement";
}

export interface MdxJsxTextElement extends MdxJsxElement {
  type: "mdxJsxTextElement";
}

export interface ProgramEsmNode extends UnistNode {
  type: "mdxjsEsm" | "mdxJsxAttributeValueExpression";
  value?: string;
  data: {
    estree: AcornNode;
  } & UnistLiteral["data"];
}

export interface PlainEsmNode extends UnistNode {
  type: "mdxjsEsm";
  value: string;
}
export type EsmNode = PlainEsmNode | ProgramEsmNode;

export type MdxAnyElement = MdxJsxFlowElement | MdxJsxTextElement;

export type MdxastNode = MdastContent | MdxAnyElement | EsmNode;

// MDXPage types

export type MDXPageFrontmatter = Record<string, unknown>;

export interface MDXPageData<T = MDXPageFrontmatter> extends VFileData {
  uri: string;
  frontmatter: T;
  content: string;
}

export interface MDXPage<T = MDXPageFrontmatter> extends VFile {
  data: MDXPageData<T>;
}
