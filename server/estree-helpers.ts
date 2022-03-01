/*
 * MDX v2 added undocumented support for random JavaScript nodes
 * (v1 olny allowed for import/export nodes).
 * But for them to work they need to have estree of the node itself.
 * Acorn's config and plugins list is copied from mdx parser.
 */

import type { Property, ObjectExpression } from "estree-jsx";

import acorn, { Parser } from "acorn";
import acornJsx from "acorn-jsx";

const AcornParser = Parser.extend(acornJsx());

export const createEstree = (value: string): acorn.Node => {
  return AcornParser.parse(value, {
    ecmaVersion: 2020,
    sourceType: "module",
    locations: false,
    ranges: false,
  });
};

export const createLiteral = (key: string, value: string): Property => ({
  type: "Property",
  kind: "init",
  method: false,
  shorthand: false,
  computed: false,
  key: {
    type: "Identifier",
    name: key,
  },
  value: {
    type: "Literal",
    raw: `"${value}"`,
    value,
  },
});

export const createIdentifier = (key: string, value: string): Property => ({
  type: "Property",
  kind: "init",
  method: false,
  shorthand: false,
  computed: false,
  key: {
    type: "Identifier",
    name: key,
  },
  value: { type: "Identifier", name: value },
});

export const createObjectExpression = (
  properties: Property[] = []
): ObjectExpression => {
  return {
    type: "ObjectExpression",
    properties,
  };
};
