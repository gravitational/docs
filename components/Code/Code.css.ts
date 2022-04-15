/* theme taken from https://github.com/highlightjs/highlight.js/blob/master/src/styles/monokai.css */

import { style, globalStyle } from "@vanilla-extract/css";
import { vars, media } from "styles/variables.css";

const {
  color,
  radii,
  spacing,
  font: { family, lineHeight, size },
} = vars;

export const wrapper = style({
  display: "block",
  overflowX: "auto",
  margin: 0,
  padding: `${spacing.m1} ${spacing.m2}`,
  borderRadius: radii.default,
  color: "#ddd",
  fontFamily: family.monospace,
  lineHeight: lineHeight.md,
  whiteSpace: "pre",
  backgroundColor: color.code,
  "@media": {
    [media.sm]: {
      fontSize: size.sm,
    },
    [media.md]: {
      fontSize: size.md,
    },
  },
});

globalStyle(`${wrapper} code`, {
  fontFamily: "inherit",
});

globalStyle(
  [
    `${wrapper} .hljs-tag`,
    `${wrapper} .hljs-keyword`,
    `${wrapper} .hljs-selector-tag`,
    `${wrapper} .hljs-literal`,
    `${wrapper} .hljs-strong`,
    `${wrapper} .hljs-name`,
  ].join(", "),
  {
    color: "#f92672",
  }
);

globalStyle(`${wrapper} .hljs-code`, {
  color: "#66d9ef",
});

globalStyle(`${wrapper} .hljs-class .hljs-title`, {
  color: "white",
});

globalStyle(
  [
    `${wrapper} .hljs-attribute`,
    `${wrapper} .hljs-symbol`,
    `${wrapper} .hljs-regexp`,
    `${wrapper} .hljs-link`,
  ].join(", "),
  {
    color: "#bf79db",
  }
);

globalStyle(
  [
    `${wrapper} .hljs-string`,
    `${wrapper} .hljs-bullet`,
    `${wrapper} .hljs-subst`,
    `${wrapper} .hljs-title`,
    `${wrapper} .hljs-section`,
    `${wrapper} .hljs-emphasis`,
    `${wrapper} .hljs-type`,
    `${wrapper} .hljs-built_in`,
    `${wrapper} .hljs-builtin-name`,
    `${wrapper} .hljs-selector-attr`,
    `${wrapper} .hljs-selector-pseudo`,
    `${wrapper} .hljs-addition`,
    `${wrapper} .hljs-variable`,
    `${wrapper} .hljs-template-tag`,
    `${wrapper} .hljs-template-variable`,
  ].join(", "),
  {
    color: "#a6e22e",
  }
);

globalStyle(
  [
    `${wrapper} .hljs-comment`,
    `${wrapper} .hljs-quote`,
    `${wrapper} .hljs-deletion`,
    `${wrapper} .hljs-meta`,
  ].join(", "),
  {
    color: "#75715e",
  }
);

globalStyle(
  [
    `${wrapper} .hljs-keyword`,
    `${wrapper} .hljs-selector-tag`,
    `${wrapper} .hljs-literal`,
    `${wrapper} .hljs-doctag`,
    `${wrapper} .hljs-title`,
    `${wrapper} .hljs-section`,
    `${wrapper} .hljs-type`,
    `${wrapper} .hljs-selector-id`,
  ].join(", "),
  {
    fontWeight: "bold",
  }
);
