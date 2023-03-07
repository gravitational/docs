/*
 * Bunch of helper utils use to create different kinds of mdx nodes.
 * Used inside remark and rehype plugins.
 */

import type {
  EsmNode,
  ProgramEsmNode,
  MdxJsxAttribute,
  MdxJsxAttributeValue,
  MdxAnyElement,
  MdxastNode,
} from "./types-unist";

import { createEstree } from "./estree-helpers";

export const createMdxjsEsmNode = (value: string): EsmNode => {
  return {
    type: "mdxjsEsm",
    value,
    data: {
      estree: createEstree(value),
    },
  };
};

export const createMdxJsxAttributeValueExpression = (
  value: string
): ProgramEsmNode => {
  return {
    type: "mdxJsxAttributeValueExpression",
    value: `"${value}"`,
    data: {
      estree: createEstree(value),
    },
  };
};

export const createMdxJsxAttribute = (
  name: string,
  value: MdxJsxAttributeValue
): MdxJsxAttribute => ({
  type: "mdxJsxAttribute",
  name,
  value,
});

export const createMdxjsEsmImportNode = (
  name: string,
  path: string
): EsmNode => {
  return createMdxjsEsmNode(`import ${name} from "${path}";`);
};

export const createMdxJsxFlowElement = (
  name: string,
  { children = [], ...props }: Record<string, unknown>
): MdxAnyElement => {
  return {
    type: "mdxJsxFlowElement",
    name,
    children: children as MdxastNode[],
    attributes: Object.entries(props)
      .filter(([, value]) => typeof value !== undefined)
      .map(([name, value]) => ({
        type: "mdxJsxAttribute",
        name,
        value,
      })) as MdxJsxAttribute[],
  };
};

// Attribute helpers

export const hasAttribute = (
  attributes: MdxJsxAttribute[] = [],
  name: string
): boolean => !!attributes.some((attr) => attr.name === name);

export const getAttribute = (attributes: MdxJsxAttribute[], name: string) => {
  const localPath = attributes.find((attribute) => attribute.name === name);

  return (localPath?.value as string) ?? "";
};

export const updateOrCreateAttribute = (
  node: MdxAnyElement,
  name: string,
  value: MdxJsxAttributeValue
) => {
  if (hasAttribute(node.attributes, name)) {
    node.attributes = node.attributes.map((attribute) => {
      if (attribute.name === name) {
        return { ...attribute, value: value };
      }

      return attribute;
    });
  } else {
    node.attributes.push(createMdxJsxAttribute(name, value));
  }
};

export const filterByAttibuteName = (
  attributes: MdxJsxAttribute[] = [],
  whiteList: string[]
): MdxJsxAttribute | undefined =>
  attributes.find(({ name }) => whiteList.includes(name));
